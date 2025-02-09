import { Amplify } from 'aws-amplify';

const awsConfig = {
  // Add your AWS Amplify configuration here
  // You'll get this from the AWS Amplify Console
  Auth: {
    // Authentication configuration
  },
  DataStore: {
    // DataStore configuration
  }
};

Amplify.configure(awsConfig); 