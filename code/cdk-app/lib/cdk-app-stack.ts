import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as path from "path";
import * as fs from "fs";

export class CdkAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 擬似パラメータインスタンス作成
    const pseudo = new cdk.ScopedAws(this);

    // JSONファイルパス
    const filePath = path.join(`${__dirname}`, "./json/test-policy.json");

    // JSON文字列をJavaScriptオブジェクトに変換
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // 文字列置換
    const jsonPolicy = JSON.parse(
      JSON.stringify(jsonData)
        .replace(/{Partition}/g, pseudo.partition)
        .replace(/{Region}/g, pseudo.region)
        .replace(/{Account}/g, pseudo.accountId)
    );

    // IAMポリシー作成
    new iam.ManagedPolicy(this, "policy", {
      managedPolicyName: "iam-policy",
      document: iam.PolicyDocument.fromJson(jsonPolicy),
    });
  }
}
