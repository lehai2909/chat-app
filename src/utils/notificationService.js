import {DynamoDBClient, PutItemCommand} from "@aws-sdk/client-dynamodb";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-provider-cognito-identity";

export async function userNotify(email) {
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
  let now = new Date().toISOString();
  const input = {
    // ScanInput
    TableName: "users-login", // required
    Item: {
      email: {
        S: email,
      },
      lastLogin: {
        S: now,
      },
    },
  };
  console.log("Loggin user: " + email + " at " + now);
  const command = new PutItemCommand(input);
  const response = await client.send(command);
  console.log(response);
}
