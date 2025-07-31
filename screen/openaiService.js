import { OPENAI_API_KEY } from '../config';
import { OpenAI } from 'openai';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const tools = [
  {
    name: 'fetchWork',
    description: 'Summarize and give insights according to the bookings.',
    parameters: {
      type: 'object',
      properties: {
        userId:   { type: 'string',  description: 'The Firebase UID of the user' },
        maxItems: { type: 'integer', description: 'Maximum number of schedules to fetch', default: 5 }
      },
      required: ['userId'],
      additionalProperties: false
    }
  }
];

export async function getSummaryForUser(userId) {
  // Build your initial messages array
  const systemMessage = {
    role: 'system',
    content: 'You are an assistant that summarizes booking schedules.'
  };
  const userMessage = {
    role: 'user',
    content: `My Firebase UID is ${userId}. Please get my recent schedules and provide a concise summary and helpful insights.`
  };
  const messages = [systemMessage, userMessage];

  //  First turn: let the model decide to call fetchWork
  const first = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    functions: tools,
    function_call: 'auto'
  });

  const msg = first.choices[0].message;

  if (msg.function_call) {
    //  Parse its requested arguments
    const { name, arguments: rawArgs } = msg.function_call;
    const { userId: uid, maxItems = 5 } = JSON.parse(rawArgs || '{}');

    //  Actually fetch from Firestore
    const schedQ = query(
      collection(db, 'users', uid, 'schedules'),
      orderBy('availability', 'desc'),
      limit(maxItems)
    );
    const snap = await getDocs(schedQ);
    const schedules = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    //  Second turn: feed **your original messages** plus the function result
    const second = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        ...messages,
        {
          role: 'function',
          name,
          content: JSON.stringify(schedules)
        }
      ]
    });

    return second.choices[0].message.content;
  }

  //  If it never called your function, return the direct reply
  return msg.content;
}