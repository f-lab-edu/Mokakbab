import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailsService {
    constructor(private readonly mailerService: MailerService) {}

    sendVerificationEmail(email: string, verificationCode: string) {
        return this.mailerService.sendMail({
            to: email,
            subject: "이메일 인증코드 전송",
            text: "이메일 인증코드 전송",
            html: `<!DOCTYPE html>
			<html lang="ko">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>이메일 인증</title>
			</head>
			<body
				style='font-family: Arial, sans-serif;
					   margin: 0;
					   padding: 0;
					   background-color: #f4f4f4;
					   text-align: center;'
				>
				<div
					style='padding: 20px;
						   background-color: #ffffff;
						   border-radius: 5px;
						   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);'
					>
					<h1>이메일 인증</h1>
					
					<p
						style='font-size: 24px;
							   font-weight: bold;
							   color: #007bff;'
						>${verificationCode}</p>
					<p style='margin-top:30px;'>이 코드를 인증 페이지에서 입력하여 가입을 완료하세요.</p>
					
				</div>
			</body>
			</html>
			`,
        });
    }
}
