export const caseStudy2Evidence = {
  briefing: `At 11:45 PM on a Friday, the cloud infrastructure of 'FinTech Flow' went completely offline. When the engineering team woke up, their databases were encrypted, and their backup servers were wiped. We have collected 5 artifacts: Slack logs, Server configurations, AWS CloudTrail logs, Network traffic, and a Ransom Note. Read the evidence, trace the attacker's lateral movement, and submit the 10 exact answers to close the case.`,

  artifacts: [
    {
      id: 'A',
      title: 'Slack Chat Logs (Friday, 4:30 PM)',
      content: `[4:30 PM] @Dev_Dave: Hey team, the CI/CD pipeline is failing on the new logging module.
[4:32 PM] @Senior_Sarah: Did you update the text formatting package?
[4:35 PM] @Dev_Dave: Yeah, I just swapped to color-formatter-pro. It fixed the build! Pushing to production now.
[4:36 PM] @Senior_Sarah: Wait, didn't the security team flag that author last week?
[4:37 PM] @Dev_Dave: Hmm, let me check... Actually, I don't see any recent comms about it. Code's already running on prod.
[4:38 PM] @Senior_Sarah: This is concerning. Can you roll it back?
[4:40 PM] @Dev_Dave: It's fine, we're running it in a container. Worst case we restart.`,
      type: 'text',
    },
    {
      id: 'B',
      title: 'Application Config (auth.config.ts)',
      content: `export const authConfig = {
  tokenExpiration: '24h',
  algorithm: 'HS256',
  // WARNING: Move this to .env before Monday's audit!
  jwt_secret: 'SuperSecretKey123',
  issuer: 'fintech-flow-auth',
  refreshTokenExpiry: '7d',
};

export const databaseConfig = {
  host: 'db-prod-01.fintech.internal',
  port: 5432,
  database: 'fintech_prod',
};

export const awsConfig = {
  region: 'us-east-1',
  s3Bucket: 'fintech-flow-database-backups',
};`,
      type: 'code',
    },
    {
      id: 'C',
      title: 'AWS CloudTrail Logs (Friday, 11:15 PM)',
      content: `{"eventID": "evt-001", "eventName": "ConsoleLogin", "eventTime": "2024-01-12T23:10:15Z", "userIdentity": {"type": "IAMUser", "userName": "contractor_dev"}, "sourceIPAddress": "198.51.100.45", "awsRegion": "us-east-1", "requestParameters": null, "responseElements": {"ConsoleLogin": "Success"}}
{"eventID": "evt-002", "eventName": "GetUser", "eventTime": "2024-01-12T23:12:30Z", "userIdentity": {"type": "IAMUser", "userName": "contractor_dev"}, "requestParameters": {"userName": "backup_svc"}}
{"eventID": "evt-003", "eventName": "AssumeRole", "eventTime": "2024-01-12T23:15:02Z", "userIdentity": {"type": "IAMUser", "userName": "backup_svc"}, "requestParameters": {"roleArn": "arn:aws:iam::123456789:role/AdminAccess"}, "responseElements": {"credentials": {"sessionToken": "***redacted***"}}}
{"eventID": "evt-004", "eventName": "ListBuckets", "eventTime": "2024-01-12T23:15:05Z", "userIdentity": {"type": "AssumedRole", "userName": "backup_svc"}, "requestParameters": null}
{"eventID": "evt-005", "eventName": "GetBucketPolicy", "eventTime": "2024-01-12T23:16:20Z", "userIdentity": {"type": "AssumedRole", "userName": "backup_svc"}, "requestParameters": {"bucketName": "fintech-flow-database-backups"}}
{"eventID": "evt-006", "eventName": "DeleteBucket", "eventTime": "2024-01-12T23:18:40Z", "userIdentity": {"type": "AssumedRole", "userName": "backup_svc"}, "requestParameters": {"bucketName": "fintech-flow-database-backups"}, "responseElements": {"DeleteBucketResponse": {"ResponseMetadata": {"HTTPStatusCode": 204}}}}
{"eventID": "evt-007", "eventName": "DeleteAccessKey", "eventTime": "2024-01-12T23:20:10Z", "userIdentity": {"type": "AssumedRole", "userName": "backup_svc"}, "requestParameters": {"userName": "contractor_dev"}}`,
      type: 'json',
    },
    {
      id: 'D',
      title: 'Network Firewall Logs (Friday, 11:15 PM - 11:50 PM)',
      content: `[23:15:10] ALLOWED - PROTOCOL: SSH - SRC: 198.51.100.45 - DST: 10.0.0.1 - DST_PORT: 22 - USER: contractor_dev - ACTION: Login
[23:15:35] ALLOWED - PROTOCOL: SSH - SRC: 198.51.100.45 - DST: 10.0.0.5 - DST_PORT: 22 - USER: svc_deploy - ACTION: Lateral Move
[23:25:00] ALLOWED - PROTOCOL: SCP - SRC: 10.0.0.5 - DST: 198.51.100.45 - BYTES: 4.2GB - FILE: database_backup.tar.gz
[23:30:10] ALLOWED - PROTOCOL: SCP - SRC: 10.0.0.5 - DST: 198.51.100.45 - BYTES: 4.2GB - FILE: encryption_payload.bin
[23:40:00] ALLOWED - PROTOCOL: SSH - SRC: 10.0.0.5 - DST: 10.0.0.2 - DST_PORT: 22 - CMD_EXECUTED: /opt/ransomware/deploy.sh
[23:45:00] ALLOWED - PROTOCOL: SSH - SRC: 10.0.0.5 - DST: 10.0.0.3 - DST_PORT: 22 - CMD_EXECUTED: rm -rf /var/log/syslog
[23:45:15] ALLOWED - PROTOCOL: SSH - SRC: 10.0.0.5 - DST: 10.0.0.4 - DST_PORT: 22 - CMD_EXECUTED: rm -rf /var/log/auth.log
[23:50:00] BLOCKED - PROTOCOL: SSH - SRC: 10.0.0.5 - DST: 10.0.0.100 - ALERT: Anomalous Activity Detected`,
      type: 'text',
    },
    {
      id: 'E',
      title: 'Ransom Note (Found on all servers at 11:50 PM)',
      content: `╔═══════════════════════════════════════════════════════════════╗
║                      YOUR FILES ARE LOCKED                      ║
╚═══════════════════════════════════════════════════════════════╝

YOUR FILES HAVE BEEN ENCRYPTED.

Encryption Algorithm: AES-256
Encryption Key: SECURELY STORED IN OUR SERVERS

⚠️  WARNING ⚠️
Do not attempt to decrypt them yourself, or the data will be corrupted.
Your decryption key will be deleted permanently in 48 HOURS.

TO RECOVER YOUR FILES:
1. Acquire exactly 50 XMR (Monero)
2. Send to wallet: 44AFFq5kSiGBoZ4JTvKHnhBY8mGoPd1Hg...
3. Include your unique decryption code: fintech_flow_2024_001
4. Decryption key will be sent within 24 hours of payment

⏰ TIME REMAINING: 48 HOURS
📅 DEADLINE: 2024-01-14 23:50:00 UTC

Questions?
Send email to: decryption@ransomgang.onion

Note: Payment attempts have been logged. Do not contact authorities.`,
      type: 'text',
    },
  ],

  questions: [
    {
      num: 1,
      text: 'What is the exact name of the malicious third-party package Dev_Dave installed?',
      hint: 'Look at the Slack logs for the package name and version.',
    },
    {
      num: 2,
      text: 'What is the exact leaked JWT secret found in the auth config?',
      hint: 'Check the auth configuration file for hardcoded secrets.',
    },
    {
      num: 3,
      text: 'What specific AWS service account was compromised?',
      hint: 'Look at the CloudTrail logs to see which account executed the DeleteBucket action.',
    },
    {
      num: 4,
      text: 'What is the exact name of the AWS S3 bucket the attacker deleted?',
      hint: 'The bucket name appears in both the auth config and CloudTrail logs.',
    },
    {
      num: 5,
      text: 'What specific network protocol did the attacker use to exfiltrate the data?',
      hint: 'Check the Network Firewall logs for the bulk data transfer.',
    },
    {
      num: 6,
      text: 'What is the exact external IP address the attacker sent the data to?',
      hint: 'Look at the destination IP in the network logs where 4.2GB was transferred.',
    },
    {
      num: 7,
      text: 'What algorithm did the ransomware use to lock the files?',
      hint: 'Read the ransom note carefully for the encryption method.',
    },
    {
      num: 8,
      text: 'What specific cryptocurrency ticker symbol did they request payment in?',
      hint: 'The ransom note specifies the type of cryptocurrency required.',
    },
    {
      num: 9,
      text: 'Enter the exact Linux command the attacker used to wipe the syslog.',
      hint: 'Check the Network Firewall logs for SSH commands executed.',
    },
    {
      num: 10,
      text: 'Which specific employee pushed the compromised code to production?',
      hint: 'Look back at the Slack logs to identify who deployed the malicious package.',
    },
  ],
}
