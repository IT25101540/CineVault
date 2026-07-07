// IT25103608 – Herath H.M.H.S. – Component 04: Rental Management
package com.movieplatform.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class EmailNotificationService {

    private final JavaMailSender mailSender;
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd MMM yyyy");

    public EmailNotificationService(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSender = mailSenderProvider.getIfAvailable();
    }


    /**
     * Send an HTML invoice email to the user after a successful rental.
     *
     * @param toEmail       Recipient email address
     * @param rentalId      Rental ID (used as invoice number)
     * @param amount        Total fee paid (LKR)
     * @param movieTitle    Movie that was rented
     * @param rentalDate    Date of rental
     * @param dueDate       Due date (rental date + 7 days)
     * @param paymentMethod e.g. "Credit Card"
     * @param username      User's display name
     */
    public void sendInvoice(String toEmail, String rentalId, double amount,
                            String movieTitle, LocalDate rentalDate, LocalDate dueDate,
                            String paymentMethod, String username) {
        if (mailSender == null) {
            System.err.println("[EmailService] SMTP JavaMailSender is not configured. Skipping invoice email to: " + toEmail);
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("CineVault <finance.cinevault@gmail.com>");
            helper.setTo(toEmail);
            helper.setSubject("Your CineVault Invoice #" + rentalId.substring(0, 8).toUpperCase());

            String invoiceNo = "#" + rentalId.substring(0, 8).toUpperCase();
            String rentalDateStr  = rentalDate  != null ? rentalDate.format(FMT)  : "-";
            String dueDateStr     = dueDate     != null ? dueDate.format(FMT)     : "-";
            String amountStr      = String.format("LKR %,.2f", amount);
            String descLine       = (movieTitle != null && !movieTitle.isBlank())
                    ? "7-day CineVault stream license – " + movieTitle
                    : "7-day CineVault stream license";

            String html = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CineVault Invoice</title>
</head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
               style="background:#1a1a1a;border-radius:16px;border:1px solid #2a2a2a;overflow:hidden;">

          <!-- ── HEADER ── -->
          <tr>
            <td style="padding:32px 40px 0;">
              <table width="100%%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">
                      CINE<span style="color:#f97316;">VAULT</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-size:20px;font-style:italic;font-weight:700;color:#f97316;">invoice</span><br/>
                    <span style="font-size:12px;color:#9ca3af;">%s</span>
                  </td>
                </tr>
              </table>
              <hr style="border:none;border-top:1px dashed #333;margin:24px 0 20px;"/>
            </td>
          </tr>

          <!-- ── BILLED TO / DATES ── -->
          <tr>
            <td style="padding:0 40px;">
              <table width="100%%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:top;width:50%%;">
                    <span style="font-size:10px;letter-spacing:1.5px;color:#6b7280;text-transform:uppercase;">Billed To</span><br/>
                    <span style="font-size:14px;color:#d1d5db;margin-top:6px;display:block;">%s</span>
                    <span style="font-size:12px;color:#9ca3af;">%s</span>
                  </td>
                  <td style="vertical-align:top;text-align:right;">
                    <span style="font-size:10px;letter-spacing:1.5px;color:#6b7280;text-transform:uppercase;">Invoice Date</span><br/>
                    <span style="font-size:14px;color:#d1d5db;display:block;margin-top:4px;">%s</span>
                    <br/>
                    <span style="font-size:10px;letter-spacing:1.5px;color:#6b7280;text-transform:uppercase;">Due Date</span><br/>
                    <span style="font-size:14px;color:#9ca3af;display:block;margin-top:4px;">%s</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── ITEMS TABLE ── -->
          <tr>
            <td style="padding:24px 40px 0;">
              <table width="100%%" cellpadding="0" cellspacing="0"
                     style="background:#222;border-radius:10px;overflow:hidden;">
                <tr style="background:#2a2a2a;">
                  <td style="padding:12px 20px;font-size:10px;letter-spacing:1.5px;color:#9ca3af;text-transform:uppercase;">
                    Item / Description
                  </td>
                  <td style="padding:12px 20px;font-size:10px;letter-spacing:1.5px;color:#9ca3af;text-transform:uppercase;text-align:right;">
                    Amount
                  </td>
                </tr>
                <tr>
                  <td colspan="2"><hr style="border:none;border-top:1px solid #333;margin:0;"/></td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;font-size:14px;color:#e5e7eb;">%s</td>
                  <td style="padding:16px 20px;font-size:14px;color:#e5e7eb;text-align:right;">%s</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── PAYMENT / TOTAL ── -->
          <tr>
            <td style="padding:20px 40px 0;">
              <hr style="border:none;border-top:1px dashed #333;margin:0 0 16px;"/>
              <table width="100%%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:13px;color:#9ca3af;">Payment Method:</td>
                  <td style="font-size:13px;color:#d1d5db;text-align:right;">%s</td>
                </tr>
                <tr>
                  <td style="font-size:13px;color:#9ca3af;padding-top:10px;">Total Paid:</td>
                  <td style="font-size:22px;font-weight:700;color:#f97316;text-align:right;padding-top:8px;">%s</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="padding:28px 40px 36px;text-align:center;">
              <hr style="border:none;border-top:1px dashed #333;margin:0 0 24px;"/>
              <p style="margin:0;font-size:14px;color:#d1d5db;font-weight:600;">Thank you for your rental!</p>
              <p style="margin:8px 0 0;font-size:12px;color:#6b7280;">
                For questions, contact <a href="mailto:support@cinevault.com"
                style="color:#f97316;text-decoration:none;">support@cinevault.com</a>
              </p>
            </td>
          </tr>

        </table>

        <!-- sub-footer -->
        <p style="margin:20px 0 0;font-size:11px;color:#4b5563;">
          © 2026 CineVault · All rights reserved
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
""".formatted(
                    invoiceNo,          // invoice number
                    username,           // billed to name
                    toEmail,            // billed to email
                    rentalDateStr,      // invoice date
                    dueDateStr,         // due date
                    descLine,           // item description
                    amountStr,          // item amount
                    paymentMethod,      // payment method
                    amountStr           // total paid
            );

            helper.setText(html, true);
            mailSender.send(message);
            System.out.println("[EmailService] Invoice email sent to " + toEmail + " for rental " + rentalId);

        } catch (Exception ex) {
            // Email failure must NOT block the rental transaction
            System.err.println("[EmailService] Failed to send invoice email to " + toEmail + ": " + ex.getMessage());
        }
    }
}
