//
import {DynamoDBClient, QueryCommand} from "@aws-sdk/client-dynamodb";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-provider-cognito-identity";

export async function loadMessages() {
  const client = new DynamoDBClient({
    region: "ap-southeast-1",
    // credentials: fromCognitoIdentityPool({
    //     clientConfig: { region: "ap-southeast-1" },
    //     identityPoolId: "ap-southeast-1:f1bac67f-3a27-497d-bf52-acd2309fa0cb"
    // })
    credentials: fromCognitoIdentityPool({
      // Required. The unique identifier for the identity against which credentials
      // will be issued.
      identityPoolId: "ap-southeast-1:f1bac67f-3a27-497d-bf52-acd2309fa0cb",
      // Optional. The ARN of the role to be assumed when multiple roles were received in the token
      // from the identity provider.
      // customRoleArn: "arn:aws:iam::1234567890:role/MYAPP-CognitoIdentity",
      // Optional. A set of name-value pairs that map provider names to provider tokens.
      // Required when using identities associated with external identity providers such as Facebook.
      logins: {
        "cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_FQTn7iOst":
          "eyJraWQiOiJwVDFhNWdUbFJhOVVpZHE1Q1B6MEp0MTYwQ1BwUlc0SEY4S3ByYzdQcDNRPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0OTZhYjU3Yy03MDAxLTcwODUtODg5YS03NjI0MTY1NDgwNmEiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0xX0ZRVG43aU9zdCIsInBob25lX251bWJlcl92ZXJpZmllZCI6dHJ1ZSwiY29nbml0bzp1c2VybmFtZSI6ImxlZW5zZWE5NkBnbWFpbC5jb20iLCJvcmlnaW5fanRpIjoiNDg5ZmY0YzMtNmU2MC00ZWQ0LWI4ODUtYjFmNTcxMWIyNWMxIiwiYXVkIjoiNzJtYnVwN2pvMHZsczRnYmU1b3NhZzBtcXUiLCJldmVudF9pZCI6IjA1MDVmNmQ2LTQzZTUtNGRhZi1hZjM4LTI0YjMyZWY2YmNkMCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzU5ODMxNzU4LCJwaG9uZV9udW1iZXIiOiIrODQ5ODgyMTE0NzYiLCJleHAiOjE3NTk4MzUzNTgsImlhdCI6MTc1OTgzMTc1OCwianRpIjoiMjllMjAzOGItY2NlZC00Mjc3LTg5YTUtM2M4YzNmNWYzODhmIiwiZW1haWwiOiJsZWVuc2VhOTZAZ21haWwuY29tIn0.Sw-WK6itdLwQVzYuCWQs3pptAimh4zxSN4joqVp_aYGZVN6BRESGN7qldO-Ayr2a9WDW627B49eP7J1VejVSxLrIoKWPG3J05XuzB7mjvztrnG9J7HDlnVET_bjdhgooLfCLp90IZ_ZQA4C74JlOWT7Exv_ZxT_TyeGgmukjBNehExgDk1dBMenF5-ZFJkx4FjEZVbg3NkcxWqX9ojTPqTENVyIFbRJC_fvYBIhsrGbL6CueEWi81hj4AM7--CzZ37WN9s_aqOhGP0Wxh7hWTg3LUxCFq5PSiyjl3omJ8Gc_WE6aUAQCir3K2GPUvGL1ONr6wOHK3Y461vzExQ9UtA",
      },
      clientConfig: {region: "ap-southeast-1"},
    }),
  });
  const input = {
    ExpressionAttributeValues: {
      ":conversation_id": {
        S: "hdh492682#leensea96@gmail.com",
      },
    },
    ExpressionAttributeNames: {
      "#from": "from",
    },
    KeyConditionExpression: "conversation_id = :conversation_id",
    ProjectionExpression: "content, #from",
    TableName: "chat-messages",
  };
  const command = new QueryCommand(input);
  const response = await client.send(command);
  const contents = response.Items.map((item) => item.content.S);
  console.log(contents);
}

loadMessages();
