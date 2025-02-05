<!DOCTYPE html>
<html>
<head>
    <title>Email Verification</title>
</head>
<body>
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #002364;">IELTS Platform Email Verification</h2>
        
        <p>Hello,</p>
        
        <p>Thank you for registering with our IELTS platform. Here is your verification code:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; 
                    text-align: center; font-size: 24px; letter-spacing: 2px;
                    margin: 20px 0; color: #C80F2E; font-weight: bold;">
            {{ $code }}
        </div>
        
        <p>This code will expire in 30 minutes. If you didn't request this code, 
        please ignore this email or contact our support team.</p>
        
        <hr style="border: 1px solid #ddd; margin: 30px 0;">
        
        <footer style="color: #666; font-size: 14px;">
            <p>Best regards,<br>
            IELTS Platform Team</p>
        </footer>
    </div>
</body>
</html>