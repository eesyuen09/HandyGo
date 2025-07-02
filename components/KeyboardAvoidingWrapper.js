import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

const KeyboardAvoidingWrapper = ({ children }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View>{children}</View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

KeyboardAvoidingWrapper.propTypes = {
  children: PropTypes.node.isRequired, // or PropTypes.element
};

export default KeyboardAvoidingWrapper;