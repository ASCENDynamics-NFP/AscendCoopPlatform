/***********************************************************************************************
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
*
* This file is part of Nonprofit Social Networking Platform.
*
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/
import {CommonModule} from "@angular/common";
import {Component, Input} from "@angular/core";
import {IonicModule, ModalController} from "@ionic/angular";

@Component({
  selector: "app-legal-modal",
  templateUrl: "./legal-modal.component.html",
  styleUrls: ["./legal-modal.component.scss"],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class LegalModalComponent {
  @Input() content?: "termsOfUse" | "privacyPolicy";
  privacyPolicy = `
  <h2>Privacy Policy</h2>

  <h3>1. Introduction</h3>

  <h4>Purpose of the Policy</h4>
  <p>This Privacy Policy outlines the practices of ASCENDynamics NFP Collaborative Nonprofit Network ("ASCENDynamics," "we," "us," or "our") regarding the collection, use, and disclosure of personal information we receive from users of our platform. This policy is designed to inform you about how we handle your personal data and to ensure transparency in our operations. Understanding this policy will help you make informed decisions about sharing your personal information with us.</p>

  <h4>Commitment to Privacy</h4>
  <p>At ASCENDynamics, we are deeply committed to respecting and protecting your privacy. We understand the importance of personal information entrusted to us and are dedicated to handling it responsibly and safeguarding it with appropriate measures. Our commitment extends to ensuring that we comply with privacy laws and regulations applicable to our operations and services.</p>

  <h3>2. Information Collection</h3>

  <h4>Types of Information Collected</h4>
  <p>We collect various types of personal information to provide and improve our services. This may include, but is not limited to:</p>
  <ul>
    <li>Personal Identification Information: Such as your name, email address, postal address, phone number, and other similar contact data.</li>
    <li>Account Information: Information required to create and maintain your user account, including username, password, and other identifiers.</li>
    <li>Demographic Information: Information such as age, gender, interests, and preferences.</li>
    <li>Usage Data: Information on how you interact with our platform, including access times, pages viewed, and the routes by which you access our services.</li>
    <li>Communication Data: Information contained in or relating to any communication that you send to us or through our platform.</li>
  </ul>

  <h4>Methods of Collection</h4>
  <p>The collection of personal information occurs through various means, including:</p>
  <ul>
    <li>Account Registration: When you create an account on our platform, we collect the information you provide in the registration form.</li>
    <li>Cookies and Tracking Technologies: We use cookies and similar tracking technologies to track activity on our platform and hold certain information, enhancing your experience with our services.</li>
    <li>User-Generated Content: Information that you voluntarily provide when you use certain features of our platform, such as posting in forums, participating in surveys, or making donations.</li>
    <li>Direct Communications: Information that you provide when you communicate directly with us via emails, phone calls, or other messaging services.</li>
  </ul>

  <h3>3. Use of Information</h3>

  <h4>Purpose of Collection</h4>
  <p>The information collected from our users is essential for the effective operation and enhancement of the ASCENDynamics platform. We use this information for various purposes, including:</p>
  <ul>
    <li><strong>Service Provision:</strong> To create and manage user accounts, provide and personalize our services, and process transactions.</li>
    <li><strong>Communication:</strong> To communicate with users regarding service updates, support, and administrative messages.</li>
    <li><strong>Improvement of Services:</strong> To understand and analyze the usage trends and preferences of our users, which helps us improve our platform's functionality and develop new features and services.</li>
    <li><strong>Security:</strong> To enhance the security of our platform, prevent fraud, and ensure the integrity of our services.</li>
    <li><strong>Legal Obligations:</strong> To comply with legal requirements and assist law enforcement agencies as required by law.</li>
  </ul>

  <h4>Data Analysis</h4>
  <p><strong>Statistical Evaluation:</strong> We may perform statistical, demographic, and marketing analyses of users of the platform, and their purchasing patterns, for product development purposes and to generally inform advertisers about the nature of our user base.</p>
  <p><strong>Anonymized Data:</strong> We use anonymized and aggregated data for these analyses, which do not identify individual users, to improve our services and for business and marketing purposes.</p>

  <h3>4. Cookies and Tracking Technologies</h3>

  <h4>Use of Cookies</h4>
  <p><strong>Functionality:</strong> Cookies are small data files stored on your device that help us improve our platform and your experience, see which areas and features of our platform are popular, and count visits.</p>
  <p><strong>Personalization:</strong> Cookies are also used to store your preferences and settings, provide personalized content and ads, and analyze how our platform is performing.</p>

  <h4>Control of Cookies</h4>
  <p><strong>Browser Settings:</strong> You can control and/or delete cookies as you wish – for details, see <a href="https://www.aboutcookies.org" target="_blank">aboutcookies.org</a>. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.</p>
  <p><strong>Opt-Out Options:</strong> If you opt out of cookies, you may not be able to use certain features of the platform, and your user experience may be adversely impacted.</p>

  <h3>5. Disclosure of Information</h3>

  <h4>Circumstances of Disclosure</h4>
  <p>We may disclose the personal information we collect or you provide as described in this policy:</p>
  <ul>
    <li><strong>Legal Compliance and Protection:</strong> To comply with any court order, law, or legal process, including responding to any government or regulatory request, or if we believe disclosure is necessary or appropriate to protect the rights, property, or safety of ASCENDynamics, our users, or others.</li>
    <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, reorganization, bankruptcy, or other similar event, your information may be transferred to the successor entity.</li>
  </ul>

  <h4>Third-Party Sharing</h4>
  <p><strong>Service Providers:</strong> We may share your information with third parties who perform services on our behalf (e.g., payment processing, data analysis, email delivery, hosting services).</p>
  <p><strong>Partnerships:</strong> We may disclose information to our partners in accordance with our agreements with them, including advertisers and sponsors of our services.</p>
  <p><strong>Consent:</strong> We may also disclose your personal information to any other third party with your prior consent.</p>

  <h3>6. User Rights</h3>

  <h4>Access and Control</h4>
  <p><strong>Viewing and Updating Information:</strong> Users have the right to access and update their personal information at any time. This can typically be done through the user profile settings on the ASCENDynamics platform.</p>
  <p><strong>Data Portability:</strong> Upon request, we will provide you with a copy of your personal data in a structured, commonly used, and machine-readable format.</p>
  <p><strong>Account Deletion:</strong> Users can request the deletion of their account and associated data. Some information may be retained for a certain period as required by law or for legitimate business purposes.</p>

  <h4>Opt-Out Options</h4>
  <p><strong>Marketing Communications:</strong> Users can opt out of receiving marketing emails from us by following the unsubscribe link included in such emails.</p>
  <p><strong>Cookie Preferences:</strong> Users can manage their cookie preferences through their browser settings, allowing them to refuse certain types of cookies.</p>

  <h3>7. Data Security</h3>

  <h4>Security Measures</h4>
  <p><strong>Protection Strategies:</strong> We implement a variety of security measures, including encryption, firewalls, and secure server facilities, to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our platform.</p>
  <p><strong>Regular Reviews:</strong> Our security policies are regularly reviewed and enhanced as necessary, and only authorized personnel have access to personal information. We are committed to ensuring that your information is secure.</p>

  <h4>Data Breach Procedures</h4>
  <p><strong>Incident Response:</strong> In the event of a data breach, we have implemented procedures to respond promptly to secure the data, assess the risk to individuals, and take appropriate steps to rectify the breach.</p>
  <p><strong>Notification:</strong> Should any breach result in a high risk to the rights and freedoms of individuals, we will notify affected users without undue delay.</p>
  <p><strong>Regulatory Compliance:</strong> We will also communicate any data breaches to the appropriate regulatory authorities as required by law, detailing the extent of the breach and any measures taken to address it.</p>

  <h3>8. International Users</h3>

  <h4>International Data Transfer</h4>
  <p><strong>Cross-Border Data Transfers:</strong> Personal information collected on the ASCENDynamics platform may be stored and processed in any country where we operate or where our service providers are located. By using our platform, you consent to the transfer of information to countries outside of your country of residence, which may have different data protection rules than those of your country.</p>
  <p><strong>Safeguards:</strong> We take appropriate measures to ensure that your personal information remains protected and secure in accordance with this Privacy Policy, regardless of where it is processed.</p>

  <h4>Regional Privacy Laws</h4>
  <p><strong>Compliance with Local Laws:</strong> ASCENDynamics is committed to complying with regional privacy laws and regulations, including the General Data Protection Regulation (GDPR) for our European users. This includes provisions for data subject rights such as access, rectification, erasure, and data portability.</p>
  <p><strong>Specific Rights for EU Residents:</strong> If you are a resident of the European Union, you have certain rights under the GDPR, including the right to object to processing and the right to lodge a complaint with a supervisory authority.</p>

  <h3>9. Policy Updates</h3>

  <h4>Changes to the Policy</h4>
  <p><strong>Notification of Changes:</strong> We reserve the right to update or modify this Privacy Policy at any time and without prior notice. Changes to our Privacy Policy will be posted on our platform and, where appropriate, notified to you by email or other means.</p>
  <p><strong>Review Responsibility:</strong> We encourage users to frequently review the Privacy Policy for any changes to stay informed about how we are protecting the personal information we collect.</p>

  <h4>User Acknowledgement</h4>
  <p><strong>Acceptance of Revised Terms:</strong> Your continued use of the ASCENDynamics platform after any changes or revisions to this Privacy Policy signifies your agreement with the terms of the revised policy. If you do not agree to the new terms, you should discontinue using the ASCENDynamics platform.</p>

  <h3>10. Contact Information</h3>

  <h4>Queries and Complaints</h4>
  <p><strong>Direct Contact:</strong> If you have any questions, concerns, or complaints about this Privacy Policy or our handling of your personal data, you can contact us through the following means:</p>
  <ul>
    <li><strong>Email:</strong> support@ascendynamics.org - for direct communication with our privacy team.</li>
    <li><strong>Mailing Address:</strong> 7649 W Irving Park Rd #N1, Chicago, IL, United States 60634 - for formal written inquiries or complaints.</li>
    <li><strong>Phone:</strong> ###-###-#### - for immediate concerns or queries.</li>
  </ul>
  <p><strong>Response Commitment:</strong> Our team is dedicated to addressing your concerns as promptly and thoroughly as possible. We aim to respond to all inquiries within one week of receipt.</p>
  <p><strong>Feedback Process:</strong> We value your feedback and are committed to improving our policies and practices based on your input.</p>

  <h3>11. Effective Date</h3>

  <h4>Policy Effective Date</h4>
  <p><strong>Date of Effectiveness:</strong> This Privacy Policy is effective as of January 1, 2024.</p>
  <p><strong>Previous Versions:</strong> If applicable, note that previous versions of the Privacy Policy can be obtained by contacting us.</p>
  <p><strong>Acknowledgement of Updates:</strong> By continuing to use the ASCENDynamics platform on or after this date, you agree to the terms of this Privacy Policy.</p>`;

  termsOfUse = `
  <h2>Terms of Use</h2>

  <h3>1. Introduction</h3>

  <h4>Purpose of the Document</h4>
  <p>This Terms of Use document ("Terms") serves as a binding agreement between ASCENDynamics NFP Collaborative Nonprofit Network ("ASCENDynamics," "we," "us," or "our") and you, the user ("User," "you," or "your"). This document outlines the rules, guidelines, and conditions under which you may access and use our platform and its associated services. The purpose of these Terms is to ensure a clear understanding of the mutual responsibilities and to maintain a safe, respectful, and legally compliant environment for all users. By accessing and using our platform, you agree to comply with these Terms, which are designed to promote positive and productive interactions within our community.</p>

  <h4>Acceptance of Terms</h4>
  <p>By registering for an account, accessing, or using our platform in any capacity, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not use or access our platform. Your continued use of the platform will be deemed as acceptance of any amended or updated Terms.</p>

  <h3>2. User Eligibility</h3>

  <h4>Age Requirement</h4>
  <p>To create an account and engage with the ASCENDynamics platform, you must be at least 18 years of age. By agreeing to these Terms, you represent and warrant that you are of legal age to form a binding contract with ASCENDynamics. If you are not of legal age, you must not access or use the platform.</p>

  <h4>User Representation</h4>
  <p>When creating an account and using our platform, you agree to: (1) provide accurate, truthful, current, and complete information about yourself as prompted by our registration forms ("Registration Data"); and (2) maintain and promptly update the Registration Data to keep it accurate, current, and complete. You acknowledge that if any information provided by you is untrue, inaccurate, not current, or incomplete, we reserve the right to suspend or terminate your account and refuse any and all current or future use of our platform.</p>

  <h3>3. User Account and Responsibilities</h3>

  <h4>Account Creation</h4>
  <p>To access the full features of the ASCENDynamics platform, you must create an account. Account creation involves the following steps:</p>
  <ul>
    <li><strong>Registration:</strong> Complete the registration form by providing required information, including but not limited to your name, email address, and password.</li>
    <li><strong>Verification:</strong> Depending on the platform's requirements, you may need to verify your email address or phone number to confirm your identity.</li>
    <li><strong>Profile Setup:</strong> You may be prompted to set up a user profile, which could include additional personal details, preferences, and areas of interest.</li>
  </ul>

  <h4>Account Responsibilities</h4>
  <p>As a user of the ASCENDynamics platform, you are responsible for maintaining the confidentiality of your account information, including your password, and for all activities that occur under your account. You agree to:</p>
  <ul>
    <li><strong>Secure Your Account:</strong> Take reasonable steps to protect your account information from unauthorized access.</li>
    <li><strong>Notify of Unauthorized Use:</strong> Immediately notify ASCENDynamics of any unauthorized use of your account or any other breach of security.</li>
    <li><strong>Account Conduct:</strong> Ensure that your use of the account complies with these Terms and all applicable laws and regulations.</li>
  </ul>

  <h3>4. Prohibited Activities</h3>

  <h4>List of Prohibited Activities</h4>
  <p>While using the ASCENDynamics platform, the following activities are strictly prohibited:</p>
  <ul>
    <li><strong>Illegal Activities:</strong> Engaging in illegal activities or promoting criminal actions.</li>
    <li><strong>Harassment and Abuse:</strong> Harassing, bullying, or threatening other users, or promoting violence or harm.</li>
    <li><strong>False Information:</strong> Knowingly disseminating false or misleading information.</li>
    <li><strong>Infringement of Rights:</strong> Violating the intellectual property rights of others.</li>
    <li><strong>Spamming:</strong> Sending unsolicited messages or spam.</li>
    <li><strong>Hacking and Unauthorized Access:</strong> Attempting to gain unauthorized access to other user accounts or the platform's systems.</li>
    <li><strong>Other Disruptive Behaviors:</strong> Engaging in any other activity that disrupts the platform's operation or harms other users.</li>
  </ul>

  <h4>Consequences of Violating Rules</h4>
  <p>Violation of these rules may result in a range of actions taken by ASCENDynamics, depending on the severity and nature of the violation. These actions include, but are not limited to:</p>
  <ul>
    <li><strong>Warning:</strong> Issuing a warning to the offending user.</li>
    <li><strong>Temporary Suspension:</strong> Temporarily suspending the user's access to the platform.</li>
    <li><strong>Permanent Ban:</strong> Permanently banning the user from the platform.</li>
    <li><strong>Legal Action:</strong> Initiating legal proceedings if the violation constitutes a criminal offense or causes significant harm to ASCENDynamics or its users.</li>
  </ul>

  <h3>5. Content Ownership and Use</h3>

  <h4>User-Generated Content</h4>
  <p><strong>Posting Guidelines:</strong> Users are encouraged to share, post, and create content that is beneficial to the community. However, all user-generated content must comply with our platform's standards, which prohibit offensive, harmful, or illegal content.</p>
  <p><strong>Responsibility for Content:</strong> You are solely responsible for the content you post, including its legality, reliability, and appropriateness. ASCENDynamics NFP does not claim ownership of the content you provide and post on the platform.</p>
  <p><strong>License to Use:</strong> By posting content on the ASCENDynamics platform, you grant us a non-exclusive, worldwide, royalty-free, perpetual, and transferable license to use, reproduce, modify, display, and distribute your content in connection with the platform's services. This license is solely for the purpose of operating, promoting, and improving our services.</p>

  <h4>Intellectual Property Rights</h4>
  <p><strong>Respect for Intellectual Property:</strong> Users must respect the intellectual property rights of others. Content that infringes upon the copyrights, trademarks, patents, or other intellectual property rights of any person or entity is strictly prohibited.</p>
  <p><strong>Copyright Complaints:</strong> ASCENDynamics adheres to appropriate legal procedures for addressing allegations of copyright infringement in accordance with applicable copyright laws.</p>
  <p><strong>Content Removal:</strong> We reserve the right to remove or disable access to any content that is found to be in violation of these Terms or infringing on intellectual property rights.</p>

  <h3>6. Privacy and Data Protection</h3>

  <h4>Data Collection and Use</h4>
  <ul>
    <li><strong>Collection of Information:</strong> The ASCENDynamics platform collects various types of information from its users, including personal identification information, usage data, and other relevant data necessary for the effective operation of the service.</li>
    <li><strong>Use of Data:</strong> The collected data is used for purposes such as providing and maintaining the service, identifying and communicating with users, responding to user requests/inquiries, improving our services, and enforcing our Terms of Use.</li>
    <li><strong>Data Sharing:</strong> We do not sell or rent user data to third parties. Data may be shared with third parties only when necessary for the provision of our services, compliance with the law, or protection of our rights.</li>
  </ul>

  <h4>User Privacy</h4>
  <ul>
    <li><strong>Commitment to Privacy:</strong> Protecting user privacy is a top priority for ASCENDynamics. We implement a variety of security measures to maintain the safety of your personal information.</li>
    <li><strong>Access to Information:</strong> Users have the right to access, update, or delete the personal information we hold about them.</li>
    <li><strong>Changes to Privacy Practices:</strong> If any changes are made to our privacy practices, users will be notified through the platform or via email, as appropriate.</li>
  </ul>

  <h3>7. Disclaimers</h3>

  <h4>No Warranties</h4>
  <ul>
    <li><strong>"As Is" Basis:</strong> The ASCENDynamics platform and all content, materials, information, services, and products available through the platform, including, but not limited to, software, are provided on an "as is" and "as available" basis, without warranties of any kind, either express or implied.</li>
    <li><strong>Disclaimer of Warranties:</strong> ASCENDynamics expressly disclaims all warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the platform will be uninterrupted, timely, secure, or error-free, or that defects, if any, will be corrected.</li>
  </ul>

  <h4>Accuracy of Information</h4>
  <ul>
    <li><strong>No Guarantee of Accuracy:</strong> While ASCENDynamics strives to provide accurate and up-to-date information, we make no representations or warranties as to the accuracy, reliability, completeness, or timeliness of any information on the platform. The use of the platform and its content is at your own risk.</li>
    <li><strong>User Responsibility:</strong> Users are responsible for verifying the accuracy of information before relying on it. We are not responsible for any decisions made based on the information provided on the platform.</li>
  </ul>

  <h3>8. Limitation of Liability</h3>

  <h4>Limitations</h4>
  <ul>
    <li><strong>Scope of Liability:</strong> To the fullest extent permitted by law, ASCENDynamics shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses (even if ASCENDynamics has been advised of the possibility of such damages), resulting from: (i) the use or the inability to use the platform; (ii) unauthorized access to or alteration of your transmissions or data; (iii) statements or conduct of any third party on the platform; or (iv) any other matter relating to the platform.</li>
    <li><strong>Cap on Liability:</strong> In jurisdictions that do not allow the exclusion or limitation of liability for consequential or incidental damages, ASCENDynamics' liability is limited to the greatest extent permitted by law.</li>
    <li><strong>User Acknowledgement:</strong> By using the platform, you acknowledge and agree that the limitations of liability set forth in this section are fundamental elements of the basis of the bargain between ASCENDynamics and you, and the platform would not be provided without such limitations.</li>
  </ul>

  <h3>9. Modification of Terms</h3>

  <h4>Right to Modify Terms</h4>
  <ul>
    <li><strong>Reserve of Rights:</strong> ASCENDynamics reserves the right, at our sole discretion, to change, modify, add, or remove portions of these Terms of Use at any time. It is your responsibility to check these Terms periodically for changes.</li>
    <li><strong>Notification of Changes:</strong> Changes to the Terms will be effective immediately upon posting on the platform unless we specify otherwise. We will make reasonable efforts to notify users of significant changes through the platform interface, email notification, or other reasonable means.</li>
    <li><strong>Acceptance of Revised Terms:</strong> Your continued use of the platform following the posting of changes will mean that you accept and agree to the changes. If you do not agree to the amended terms, you must stop using the platform.</li>
  </ul>

  <h3>10. Termination of Service</h3>

  <h4>Termination by Platform</h4>
  <ul>
    <li><strong>Circumstances for Termination:</strong> ASCENDynamics may terminate or suspend your access to the platform and your account at any time, without notice, in our sole discretion, for any reason, including but not limited to a breach of these Terms.</li>
    <li><strong>Effect of Termination:</strong> Upon termination, your right to use the platform will immediately cease. If your account is terminated, you may no longer have access to data, messages, files, and other material you keep on the platform.</li>
    <li><strong>Survival of Terms:</strong> Termination of your account does not affect the applicability of those sections of these Terms that are intended to survive termination.</li>
  </ul>

  <h4>Termination by User</h4>
  <ul>
    <li><strong>User-Initiated Termination:</strong> You may terminate your account at any time through the account settings feature on the platform or by contacting our support team.</li>
    <li><strong>Responsibility for Activities Pre-Termination:</strong> Termination of your account is your sole right and remedy with respect to any dispute with us regarding the platform or these Terms. Upon termination of your account, you remain liable for all activities conducted through your account prior to termination.</li>
  </ul>

  <h3>11. Governing Law and Dispute Resolution</h3>

  <h4>Jurisdiction</h4>
  <ul>
    <li><strong>Applicable Law:</strong> These Terms of Use and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of the State of Illinois, United States.</li>
    <li><strong>Jurisdiction for Disputes:</strong> Any disputes arising out of or in connection with these Terms or the use of the ASCENDynamics platform shall be subject to the exclusive jurisdiction of the state and federal courts located in the State of Illinois, United States.</li>
  </ul>

  <h4>Dispute Resolution</h4>
  <ul>
    <li><strong>Informal Resolution:</strong> Before filing a claim against ASCENDynamics, you agree to try to resolve the dispute informally by contacting us. We'll try to resolve the dispute informally by contacting you via email.</li>
    <li><strong>Formal Legal Action:</strong> If the dispute is not resolved within a specified period after submission (e.g., 60 days), either party may initiate formal proceedings.</li>
    <li><strong>Alternative Dispute Resolution:</strong> ASCENDynamics may offer the option of resolving disputes through binding arbitration or small claims court, instead of in courts of general jurisdiction.</li>
  </ul>

  <h3>12. International Use</h3>

  <h4>International Laws</h4>
  <ul>
    <li><strong>Compliance with Local Laws:</strong> The ASCENDynamics platform is controlled and operated from our facilities in the United States. We make no representations that the platform is appropriate or available for use in other locations. Those who access or use the platform from other jurisdictions do so at their own volition and are entirely responsible for compliance with all applicable local laws and regulations, including but not limited to export and import regulations. You should not use the platform in a manner prohibited by law.</li>
  </ul>

  <h3>13. Miscellaneous</h3>

  <h4>Severability</h4>
  <ul>
    <li><strong>Validity of Remaining Provisions:</strong> If any provision of these Terms is held to be invalid, illegal, or unenforceable for any reason by any court of competent jurisdiction, such provision shall be modified to the extent necessary to make it enforceable while maintaining its intent as closely as possible. If such modification is not possible, the provision shall be severed from these Terms. The invalidity or unenforceability of any provision of these Terms shall not affect the validity or enforceability of any other provision of these Terms, which shall remain in full force and effect.</li>
  </ul>

  <h4>Entire Agreement</h4>
  <ul>
    <li><strong>Complete Understanding:</strong> These Terms, together with any amendments and any additional agreements you may enter into with ASCENDynamics in connection with the platform, shall constitute the entire agreement between you and ASCENDynamics concerning the platform. These Terms supersede and replace any prior agreements or understandings between you and ASCENDynamics regarding the platform.</li>
    <li><strong>No Oral Modifications:</strong> No modification, amendment, or waiver of any provision of these Terms shall be effective unless in writing and signed by the authorized representative of ASCENDynamics. Any oral agreement or arrangement made between you and any employee or representative of ASCENDynamics shall not be considered a modification or a waiver of these Terms.</li>
  </ul>

  <h3>14. Contact Information</h3>

  <h4>Contact Details</h4>
  <ul>
    <li><strong>General Inquiries:</strong> For any questions or concerns regarding these Terms of Use or any other aspects of your experience with the ASCENDynamics platform, please contact us at:</li>
    <ul>
      <li><strong>Email:</strong> support@ascendynamics.org</li>
      <li><strong>Mailing Address:</strong> ASCENDynamics NFP, 7649 W Irving Park Rd #N1, Illinois, USA 60706</li>
      <li><strong>Phone:</strong></li>
    </ul>
    <li><strong>Support Hours:</strong> Our support team is available Monday, Wednesday, Friday, 9 AM to 5 PM CST.</li>
    <li><strong>Response Time:</strong> We aim to respond to all inquiries within one week during our regular business hours.</li>
    <li><strong>Additional Support:</strong> For more immediate assistance, please visit our <a href="https://join.slack.com/t/ascendynamicsnfp/shared_invite/zt-1yqcw1hqa-slT2gWkBEkLOTRnN8zEqdQ">Slack</a> community.</li>
  </ul>

  <h3>15. Acknowledgement and Acceptance of Terms</h3>

  <h4>User Acknowledgement</h4>
  <ul>
    <li><strong>Agreement to Terms:</strong> By creating an account, accessing, or using the ASCENDynamics platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and any future amendments and additions to these Terms as published from time to time on the platform.</li>
    <li><strong>Informed Consent:</strong> You acknowledge that you have been given the opportunity to discuss any questions or concerns about these Terms with ASCENDynamics representatives prior to acceptance.</li>
    <li><strong>Continued Acceptance:</strong> Your continued use of the platform after any modifications or updates to these Terms are made will constitute your acceptance of such changes and agreement to be bound by the updated Terms.</li>
    <li><strong>Legal Capacity:</strong> You affirm that you are of legal age and are fully able and competent to enter into the terms, conditions, obligations, affirmations, representations, and warranties set forth in these Terms, and to abide by and comply with these Terms.</li>
  </ul>`;

  constructor(private modalController: ModalController) {}

  get contentAsHtml() {
    if (this.content === "privacyPolicy") {
      return this.privacyPolicy;
    } else if (this.content === "termsOfUse") {
      return this.termsOfUse;
    }
    return "";
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
