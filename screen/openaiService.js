import {OPENAI_API_KEY} from '../config';
import {OpenAI} from 'openai';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY});


//1. declare function that will be exposed to the model
//
const tools = [
    {
        type: 'function',
        name: 'fetchWork',
        description: "Summarize and give insights according to the bookings.",
        parameters: {
            type: 'object',
            properties: {
                userId: {type: 'string', description: "The Firebase UID of the user"},
                maxItems: { type: 'integer', description: "Maximum number of schedules to fetch"}
            },
            required: ['userId'],
            addtionalProperties: false
            }
        }
];

// Calls OpenAI to get a natural-language summary of your Firestore schedules.
//  * Under the hood, the model will first return a `function_call` to `fetchSchedules`,
//  * you execute that against Firestore, then feed the raw data back in for summarization.
//  */


export async function getSummaryForUser(userId){
    //first turn: ask the model to fetch + summarize
    const first = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content:" You are an assistant that summarizes booking schedules."},
            { role: 'user', content: 'Please get my recent schedules and provide concise summary and helpful insights.'}
        ],
        functions: tools,
        function_call: 'auto'  // “auto” lets the model choose to call fetchSchedules
    });

    const message = first.choices[0].message;

    //if the model decided to invoke your helper function instead of just answering directly.
    if(message.function_call){
        //destruct object, pull out two properties from reply.function_call
        const{ name, arguments: rawArgs } = reply.function_call;
        //because rawArgs is JSON-encoded string, need to turn into normal object using "JSON.parse"
        const { userId: uid, maxItems = 5} = JSON.parse(rawArgs);

        //2. real firestore lookup
        //query returns reference only
        const q = query(
            collection(db, 'user', uid, 'schedules'),
            orderBy('date', 'desc'),
            limit(maxItems)
        );
        //getdocs to fetch and get querysnapshot, which holds the documents data
        const snap = await getDocs(q);
        const schedules = snap.docs.map(d => ({id: d.id, ...d.data()}));

        //3. second turn: pass the fetched data back to the model
        const second = await openai.responses.create({
            model: 'gpt-4o',
            //“Here’s everything we talked about so far—including 
            // that request to call your function—plus the actual 
            // data my function fetched.”
            input: [
                ...first.messages,
                {
                    role: 'function',
                    name: name,
                    content: JSON.stringify(schedules)
                }
            ]
        });

        //4. return summary
        return second.output.choices?.[0]?.messages?.content
            ??'Sorry, I wasn;t able to summarize'
    }
    //if no function was called, just return the model's direct reply:
    return reply.choices?.[0]?.message?.content
        ??"Sorry, I didn't get that.";
}