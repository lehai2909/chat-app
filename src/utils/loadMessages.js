import {DynamoDBClient, QueryCommand} from "@aws-sdk/client-dynamodb";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-provider-cognito-identity";

export async function loadMessages(from, to) {
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
          sessionStorage.getItem("idToken"),
      },
      clientConfig: {region: "ap-southeast-1"},
    }),
  });
  const input = {
    ExpressionAttributeValues: {
      ":conversation_id": {
        S: [from, to].sort().join("#"),
      },
    },
    ExpressionAttributeNames: {
      "#from": "from",
      "#to": "to",
    },
    KeyConditionExpression: "conversation_id = :conversation_id",
    ProjectionExpression: "content, #from, #to",
    TableName: "chat-messages",
  };
  const command = new QueryCommand(input);
  const response = await client.send(command);
  const messages = response.Items.map((item) => ({
    content: item.content.S,
    from: item.from.S,
    to: item.to.S,
  }));
  return messages;
}
