# Encryption Key Backup & Restore - Complete Guide

## Overview

The encryption key backup feature allows you to securely access your encrypted messages across multiple devices while maintaining end-to-end encryption security. This guide covers everything you need to know about setting up, using, and managing your encrypted messaging.

---

## Quick Start

### For Email/Password Users

1. **Automatic Backup**: Send your first encrypted message → keys automatically backed up with your login password
2. **Seamless Restore**: Log in on new device → keys automatically restored
3. **One Password**: Use your login password for everything - no extra password needed

### For Social Login Users (Google, etc.)

1. **Set Passphrase**: Send first encrypted message → prompted to create encryption passphrase (8+ chars)
2. **Separate Protection**: Passphrase is separate from Google login, protects your encrypted messages
3. **Manual Restore**: Log in on new device → enter encryption passphrase to restore keys

---

## Technical Overview

### Security Standards

- **Key Exchange**: RSA-OAEP-2048
- **Message Encryption**: AES-256-GCM
- **Key Derivation**: PBKDF2-SHA256 (100,000 iterations)
- **Backup Encryption**: AES-256-GCM
- **Salt**: 256-bit random per user
- **IV**: 96-bit random per encryption

### Architecture

**Email/Password Flow**:

```
Login → Capture Password → First Message → PBKDF2 → AES-256 Encrypt → Firestore Backup
New Device → Login → PBKDF2 → AES-256 Decrypt → Restore Keys → Read Messages
```

**SSO Flow**:

```
Login (Google) → First Message → Prompt Passphrase → PBKDF2 → AES-256 Encrypt → Firestore
New Device → Login → Prompt Passphrase → PBKDF2 → Decrypt → Restore Keys → Read Messages
```

### Data Storage

**Local (Device)**:

- RSA key pair in localStorage
- PKCS#8 format (private), SPKI format (public)
- Base64 encoded
- Cleared on logout

**Cloud (Firestore)**:

```typescript
accounts/{uid}/encryptionKeyBackup: {
  encryptedPrivateKey: string,  // AES-GCM encrypted
  publicKey: string,             // Unencrypted (safe to expose)
  salt: string,                  // PBKDF2 salt (32 bytes)
  iv: string,                    // AES-GCM IV (12 bytes)
  iterations: number,            // 100,000
  authMethod: 'password' | 'sso',
  createdAt: Timestamp,
  lastBackupAt: Timestamp
}
```

---

## How It Works

## Setting Up Encryption Backup

### First Encrypted Message

#### Email/Password Users

1. Send an encrypted message in any chat
2. System automatically captures your login password (already entered)
3. Keys are encrypted with PBKDF2 (100,000 iterations) + AES-256-GCM
4. Backup uploaded to Firestore
5. Success message: "Your messages are now encrypted and backed up"
6. No additional steps needed!

#### Social Login Users (Google, etc.)

1. Send an encrypted message in any chat
2. Modal appears: "Set Encryption Passphrase"
3. Enter a passphrase:
   - Minimum 8 characters
   - At least one number or special character
   - Strength indicator shows real-time feedback (Weak/Medium/Strong)
4. Confirm your passphrase
5. Keys encrypted with PBKDF2 + AES-256-GCM
6. Backup uploaded to Firestore
7. Message is sent

**Why Different Approaches?**

- Email/password users: Login password already available, simplifies UX
- SSO users: No access to Google password, need separate passphrase for encryption

---

## Using Encryption on Multiple Devices

### On a New Device

#### Email/Password Users

1. Log in with your email and password
2. System detects backup exists in Firestore
3. Keys automatically restored using your login password
4. PBKDF2 derives decryption key from password
5. Private key decrypted with AES-256-GCM
6. Keys stored locally
7. You can immediately read encrypted messages
8. **Seamless experience - no prompts needed!**

#### Social Login Users

1. Log in with your social provider (e.g., Google)
2. System detects backup exists
3. Modal appears: "Restore Encryption Keys"
4. Enter your encryption passphrase
5. System uses PBKDF2 to derive decryption key
6. Private key decrypted and stored locally
7. You can now read encrypted messages

### Brute-Force Protection

- **Maximum Attempts**: 3 incorrect password/passphrase attempts
- **Lockout Duration**: 5 minutes after 3 failed attempts
- **Counter Display**: Shows remaining attempts (e.g., "2 attempts remaining")
- **Persistence**: Lockout timer stored in localStorage, survives page refreshes
- **Reset**: Counter resets after successful authentication or lockout expires

### Skip Restore / Generate New Keys

If you don't remember your password/passphrase:

1. Click "Generate New Keys" in the restore modal
2. Confirmation dialog warns you about consequences
3. **⚠️ Warning**: You will NOT be able to read previous encrypted messages
4. New RSA-2048 key pair generated locally
5. New messages will be encrypted with your new keys
6. Optional: Create new backup with current password/passphrase

**When to Use**:

- Lost password/passphrase permanently
- Compromised keys (security incident)
- Starting fresh encryption setup

**Consequences**:

- All previous encrypted messages become unreadable
- Chat participants with old keys can't decrypt new messages
- Must exchange new public keys with existing contacts

---

## Managing Your Encryption Keys

Access encryption settings from **Settings → Encryption** (EncryptionSettingsComponent).

### Backup Status Display

The settings page shows:

**Backup Status**:

- ✅ Backed Up / ❌ Not Backed Up
- Protection method: "Password-protected" or "Passphrase-protected"
- Last backup timestamp (e.g., "Last backup: Dec 20, 2024, 3:45 PM")

**Local Keys Status**:

- ✅ Available / ❌ Not Available
- Shows if keys are stored on current device

**Authentication Method**:

- Displays whether you use email/password or SSO

### Available Actions

#### 1. Backup Now / Update Backup

**Email/Password Users**:

- Click "Backup Now"
- System uses cached login password
- Keys re-encrypted and uploaded
- Updates `lastBackupAt` timestamp

**Social Login Users**:

- Click "Backup Now"
- Modal prompts for passphrase
- Keys encrypted with PBKDF2 + AES-256-GCM
- Backup uploaded to Firestore

**When to Use**:

- After generating new keys
- After password/passphrase change
- Periodic manual backups for peace of mind

#### 2. Restore Keys

- Click "Restore Keys"
- KeyRestoreModal appears
- Enter password/passphrase
- Keys downloaded from Firestore
- Decrypted and stored locally
- Can now read encrypted messages

**When to Use**:

- New device setup
- After clearing local keys
- Keys accidentally deleted

#### 3. Change Password/Passphrase

**Email/Password Users**:

1. Click "Change Password"
2. Enter old password (for verification)
3. Enter new password
4. System:
   - Verifies old password against Firestore backup
   - Decrypts private key with old password
   - Re-encrypts with new password (new salt, new IV)
   - Uploads updated backup
   - Updates local keys

**Social Login Users**:

1. Click "Change Passphrase"
2. Enter old passphrase
3. Enter new passphrase
4. Confirm new passphrase
5. Real-time strength indicator
6. System re-encrypts and updates backup

**When to Use**:

- Suspected password/passphrase compromise
- Regular security rotation
- Passphrase too weak, want stronger one

**Important**: Old password/passphrase must be correct to change

#### 4. Generate New Keys

1. Click "Generate New Keys"
2. Alert dialog warns:
   - "Previous encrypted messages will be unreadable"
   - "Are you sure?"
3. Confirm action
4. New RSA-2048 key pair generated
5. Old keys deleted locally
6. Optional: Backup new keys immediately

**⚠️ Use Only When**:

- Lost password/passphrase permanently
- Keys compromised
- Starting fresh (willing to lose old messages)

**Consequences**:

- All previous encrypted messages unreadable
- Must exchange new public keys with contacts

#### 5. Clear Local Keys

1. Click "Clear Local Keys"
2. Confirmation dialog appears
3. Confirms keys remain backed up in cloud
4. Keys deleted from localStorage
5. Cannot read encrypted messages until restore

**When to Use**:

- Shared/public computer
- Logging out permanently from device
- Troubleshooting (clear and restore)

**Safety**: Cloud backup remains intact, can restore anytime

---

## Security Features

### Cryptographic Implementation

#### Key Derivation (PBKDF2)

- **Algorithm**: PBKDF2-SHA256
- **Iterations**: 100,000 (OWASP recommended for 2024)
- **Salt**: 256-bit (32 bytes) random, unique per user
- **Output**: 256-bit AES key for backup encryption
- **Performance**: ~15-20 seconds on modern devices (intentionally slow)

#### Backup Encryption (AES-GCM)

- **Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Size**: 256 bits (derived from PBKDF2)
- **IV**: 96-bit (12 bytes) random per encryption
- **Authentication**: Built-in with GCM mode (prevents tampering)
- **Authenticated Encryption**: Provides both confidentiality and integrity

#### Message Encryption

- **Key Exchange**: RSA-OAEP-2048 (Optimal Asymmetric Encryption Padding)
- **Message Encryption**: AES-256-GCM
- **Key Fingerprint**: SHA-256 hash (first 16 chars for display)
- **IV**: Unique per message (96-bit random)

### Brute-Force Protection

#### Failed Attempt Lockout

- **Maximum Attempts**: 3 incorrect password/passphrase tries
- **Lockout Duration**: 5 minutes (300 seconds)
- **Storage**: Lockout timer in localStorage (device-specific)
- **Display**: Shows remaining attempts (e.g., "2 attempts remaining")
- **Persistence**: Lockout survives page refresh/browser restart
- **Reset Conditions**:
  - Successful authentication
  - 5 minutes elapsed
  - localStorage cleared (manual)

#### Implementation

```typescript
// Stored in localStorage:
{
  attempts: number,           // Failed attempts (0-3)
  lockedUntil: number | null, // Timestamp (null if not locked)
  lastAttempt: number         // Last attempt timestamp
}
```

### Password/Passphrase Requirements

**Email/Password Users**:

- Uses Firebase Authentication requirements:
  - Minimum 6 characters (Firebase default)
  - No additional client-side requirements
  - Firebase handles validation

**Social Login Users**:

- Custom requirements for encryption passphrase:
  - Minimum 8 characters
  - At least one number OR special character
  - Client-side validation with real-time feedback
  - Strength indicator (Weak/Medium/Strong)

**Strength Calculation**:

- Weak: Meets minimum requirements only
- Medium: 10+ chars OR (8+ chars + number + special char)
- Strong: 12+ chars + number + special char + uppercase + lowercase

### Key Storage Security

#### Local Storage (Device)

- **Location**: Browser localStorage
- **Format**:
  - Private Key: PKCS#8 format, base64 encoded
  - Public Key: SPKI format, base64 encoded
- **Encryption**: Not encrypted locally (relies on device security)
- **Lifetime**: Persists until logout or manual clear
- **Risk Mitigation**:
  - XSS protection via Content Security Policy
  - HTTPS-only transmission
  - Same-origin policy

#### Cloud Storage (Firestore)

- **Location**: `accounts/{uid}/encryptionKeyBackup` document
- **Encryption**: Private key encrypted with AES-256-GCM
- **Public Key**: Stored unencrypted (safe, designed to be public)
- **Salt & IV**: Stored with backup (required for decryption)
- **Access Control**:
  - Firestore Security Rules: Users can only access own backup
  - No server-side decryption possible
  - Password/passphrase never sent to server

### End-to-End Encryption (E2EE)

**Message Flow**:

1. Sender generates random AES-256 message key
2. Message encrypted with AES-256-GCM using message key
3. Message key wrapped with recipient's RSA-2048 public key
4. Encrypted message + wrapped key sent to Firestore
5. Recipient unwraps message key with private RSA key
6. Message decrypted with unwrapped AES key

**Security Properties**:

- Server never sees plaintext messages
- Server never sees private keys (only encrypted backup)
- Only sender and recipient can decrypt messages
- Forward secrecy not implemented (future enhancement)

---

## Important Warnings & Limitations

### ⚠️ Lost Password/Passphrase = Lost Messages

**Email/Password Users**:

- If you forget your login password **and** Firebase can't reset it
- You will **permanently** lose access to all encrypted messages
- No recovery method exists (by design for security)
- **Mitigation**:
  - Use a password manager (e.g., 1Password, Bitwarden)
  - Enable Firebase password reset email
  - Keep password secure but accessible

**Social Login Users**:

- If you forget your encryption passphrase
- There is **NO way to recover it** - period
- You will **permanently** lose access to all encrypted messages
- Server cannot help (doesn't have your passphrase)
- **Mitigation**:
  - Write passphrase down, store in secure physical location
  - Use a passphrase manager
  - Choose memorable but strong passphrase
  - Test restore on second device before relying on it

### ⚠️ Generating New Keys

**Consequences**:

- **Immediate**: Cannot read any previous encrypted messages
- **Permanent**: Old messages unrecoverable (even with password/passphrase)
- **Social Impact**: Recipients with old public key can't decrypt new messages
- **Coordination Needed**: Must share new public key with all contacts

**When Acceptable**:

- Lost password/passphrase with no recovery
- Keys compromised in security incident
- Starting fresh, willing to lose message history
- No critical information in old messages

**Alternatives to Consider First**:

1. Try password reset (email/password users)
2. Check password manager for saved passphrase
3. Try variations of remembered passphrase (within 3-attempt limit)
4. Contact support for account access (can't help with encryption)

### ⚠️ Password/Passphrase Changes

**Email/Password Users**:

- Changing Firebase password does NOT automatically update backup
- Must go to Settings → Encryption → Change Password
- Or next encrypted message will trigger backup update prompt
- Old password required to re-encrypt backup

**Social Login Users**:

- Passphrase only used for encryption (not login)
- Can change anytime in Settings → Encryption
- Old passphrase required to verify and re-encrypt

### ⚠️ Device Security

**Local Keys Vulnerability**:

- Keys stored unencrypted in localStorage
- Vulnerable to:
  - Device theft (if not locked)
  - Malware with localStorage access
  - Browser extensions with broad permissions
  - XSS attacks (mitigated by CSP)

**Mitigation**:

- Use device lock/password
- Log out on shared computers
- Avoid suspicious browser extensions
- Keep device OS/browser updated
- Clear local keys when leaving device

### ⚠️ Not Quantum-Safe

**Current State**:

- RSA-2048 vulnerable to future quantum computers
- AES-256 has partial quantum resistance (Grover's algorithm)
- Timeline: Likely safe for next 10-15 years

**Future Plans**:

- Monitor NIST post-quantum cryptography standards
- Plan migration to quantum-resistant algorithms (e.g., Kyber, Dilithium)
- Will require re-keying all users when available

### ⚠️ No Forward Secrecy

**Current Limitation**:

- If private key compromised, ALL past messages can be decrypted
- No automatic key rotation
- No per-session ephemeral keys

**Future Enhancement**:

- Implement Double Ratchet algorithm (Signal Protocol)
- Add forward secrecy with ephemeral keys
- Auto-rotate keys periodically

### ⚠️ Backup Limitations

**Single Backup**:

- Only one backup per user in Firestore
- Overwritten on each backup operation
- No backup versioning/history

**No Offline Backup**:

- Cannot export backup file
- Cannot save backup to local file
- Cloud-only backup (Firestore dependency)

**Network Dependency**:

- Backup/restore requires internet connection
- Cannot backup in offline/airplane mode
- Firestore latency affects backup speed

---

## Best Practices

### For Email/Password Users

1. **Strong Password**:

   - Minimum 12+ characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Unique (not reused from other services)
   - Use password generator for maximum strength

2. **Password Manager**:

   - Use 1Password, Bitwarden, LastPass, or similar
   - Enable browser extension for autofill
   - Store password securely with encryption
   - Enable 2FA on password manager itself

3. **Account Security**:

   - Enable Firebase email verification
   - Set up password recovery email
   - Keep recovery email secure and accessible
   - Test password reset flow periodically

4. **Regular Updates**:
   - Update backup after password changes (Settings → Encryption → Change Password)
   - Verify backup status periodically
   - Test restore on second device occasionally

### For Social Login Users

1. **Memorable Passphrase**:

   - Use 4-5 random words (e.g., "correct horse battery staple")
   - Add numbers/symbols for strength (e.g., "correct-horse-123-battery")
   - Easier to remember than random characters
   - Still meets 8-character + special char requirement

2. **Secure Storage**:

   - **Write it down** on paper, store in safe/lockbox
   - Use passphrase manager (separate from Google password)
   - Do NOT store in Google Keep, Gmail, or cloud notes
   - Consider multiple physical copies in different locations

3. **Don't Share**:

   - Never share passphrase with anyone (including support)
   - Each user should have unique passphrase
   - Partners/family members need separate accounts

4. **Test & Verify**:
   - Test passphrase restore on second device ASAP
   - Verify can decrypt messages after restore
   - Re-test after any passphrase change

### General Best Practices

1. **Multi-Device Setup**:

   - Set up encryption on primary device first
   - Test backup/restore on secondary device
   - Keep at least 2 devices with working keys
   - Reduces risk of lockout from single device failure

2. **Regular Backups**:

   - Backup after generating new keys (automatic prompt)
   - Backup after password/passphrase changes
   - Manual backup monthly (Settings → Encryption → Backup Now)
   - Verify "Last backup" timestamp is recent

3. **Device Security**:

   - Use device lock/PIN/biometric
   - Keep OS and browser updated
   - Avoid public/shared computers for sensitive chats
   - Log out when leaving device unattended
   - Clear local keys on shared devices (Settings → Clear Local Keys)

4. **Account Security**:

   - Enable 2FA on your account (email or SSO)
   - Use unique passwords across all services
   - Monitor login activity for suspicious access
   - Review authorized devices periodically

5. **Privacy Practices**:

   - Use encryption for sensitive conversations only
   - Understand encrypted messages can't be recovered without keys
   - Be cautious what you encrypt (balance security vs. recoverability)
   - Inform chat participants about encryption limitations

6. **Incident Response**:
   - If device stolen: Immediately change password/passphrase
   - If keys compromised: Generate new keys, inform contacts
   - If account hacked: Enable 2FA, review activity, change credentials
   - If unsure: Generate new keys (lose old messages but secure going forward)

---

## Troubleshooting

### "No backup found"

**Cause**: No encryption keys backed up to Firestore yet.

**Solutions**:

1. Send an encrypted message to trigger automatic backup
2. Or: Settings → Encryption → Backup Now
3. Verify "Backup Status" shows "✅ Backed Up" after action

**If Still Failing**:

- Check internet connection
- Verify Firestore rules allow backup writes
- Check browser console for errors
- Try logging out and back in

---

### "Incorrect password/passphrase"

**Cause**: Password/passphrase doesn't match what was used during backup.

**For Email/Password Users**:

1. Use your current Firebase login password
2. If recently changed, try old password first
3. If old password works, update backup: Settings → Encryption → Change Password
4. Enter old password, then new password, save

**For Social Login Users**:

1. Remember: This is your **encryption passphrase**, not Google password
2. Try common variations (capitalization, spacing)
3. Check password manager for saved passphrase
4. You have 3 attempts before 5-minute lockout

**Lockout Active**:

- Wait 5 minutes for lockout to expire
- Timer shown in modal: "Locked for X minutes Y seconds"
- Close/refresh page doesn't reset timer (stored in localStorage)

**After 3+ Failed Attempts**:

- If genuinely can't remember: Click "Generate New Keys"
- Accept that old messages will be lost
- Create new backup with correct password/passphrase

---

### "Failed to restore keys"

**Network Issues**:

1. Check internet connection (WiFi/cellular)
2. Verify can access other online features
3. Try again after connection stabilizes
4. Check browser console for Firestore errors

**Authentication Issues**:

1. Ensure using correct password/passphrase
2. Email/password users: Use Firebase login password
3. SSO users: Use encryption passphrase (not Google password)

**Corrupted Backup**:

1. Try backup again: Settings → Encryption → Backup Now
2. Generate new keys if backup persistently fails
3. Contact support with error details

**Recent Password Change**:

- Old password may still be needed for restore
- After restore succeeds, update backup with new password
- Settings → Encryption → Change Password

---

### "No encryption keys found"

**Cause**: No keys stored locally on current device.

**Solutions**:

**Option 1: Restore from Backup** (Preferred)

1. Settings → Encryption → Restore Keys
2. Enter password/passphrase
3. Keys downloaded and stored locally
4. Can now read encrypted messages

**Option 2: Generate New Keys**

1. Settings → Encryption → Generate New Keys
2. Accept warning about losing old messages
3. New keys created and stored locally
4. Future messages encrypted with new keys

**When to Choose Each**:

- Restore: If you have backup and remember password/passphrase
- Generate: If no backup exists or password/passphrase lost

---

### "Can't read old encrypted messages"

**Possible Causes**:

1. Keys regenerated (old messages encrypted with different keys)
2. Restored wrong backup
3. Backup is from different account
4. Messages from before encryption was enabled

**Diagnosis**:

1. Check Settings → Encryption → Last Backup timestamp
2. Compare with message dates (messages older than backup are readable)
3. Check if you generated new keys recently

**Solutions**:

**If Keys Were Regenerated**:

- Old messages are permanently unreadable (by design)
- No recovery method exists
- Future messages will work with current keys

**If Wrong Backup**:

- Verify logged into correct account
- Check account email in Settings
- SSO users: Ensure using same provider (Google vs. Facebook)

**If Messages Pre-date Encryption**:

- Normal behavior, messages before encryption setup aren't encrypted
- Only messages after first encrypted message are protected

---

### "Backup keeps failing"

**Browser Issues**:

1. Check localStorage not full (unlikely but possible)
2. Try incognito/private mode to test
3. Clear browser cache (WARNING: May clear local keys)
4. Try different browser

**Firestore Issues**:

1. Check Firestore quota not exceeded
2. Verify Firestore Security Rules allow writes
3. Check browser console for specific error
4. Retry after a few minutes (temporary outage)

**Permission Issues**:

1. Verify logged in correctly
2. Check account has write permissions
3. Try logging out and back in

---

### "Keys restored but messages still encrypted"

**Cause**: Messages encrypted with different key pair.

**Diagnosis**:

1. Check key fingerprint: Settings → Encryption → View Fingerprint
2. Compare with sender's public key fingerprint
3. If different, keys don't match

**Solutions**:

1. Ask sender to verify their public key
2. Ensure both users have completed key exchange
3. Try sending new test message to establish new session
4. Both users may need to regenerate keys and exchange again

---

### "Passphrase strength indicator stuck on Weak"

**Requirements Not Met**:

- Minimum 8 characters
- At least one number OR special character

**Solutions**:

1. Add a number: "mypassphrase123"
2. Or add special char: "my-passphrase!"
3. Both: "my-passphrase-123!"
4. Longer is better: "my-strong-passphrase-2024!"

**Medium Strength**:

- 10+ characters, or
- 8+ chars + number + special char

**Strong**:

- 12+ characters + number + special char + mixed case

---

### "Lockout not expiring"

**Cause**: localStorage lockout timer persists across sessions.

**Check Lockout Status**:

1. Open browser DevTools (F12)
2. Application tab → Local Storage
3. Look for key: `keyRestoreLockout`
4. Value shows `{ attempts, lockedUntil, lastAttempt }`

**Force Clear Lockout** (if legitimately stuck):

1. DevTools → Application → Local Storage
2. Delete `keyRestoreLockout` key
3. Refresh page
4. Lockout cleared, can retry

**Note**: Only use if genuinely stuck (e.g., timer bug). Don't use to bypass legitimate lockout.

---

### "Can't change password/passphrase"

**Old Password/Passphrase Incorrect**:

1. Verify old credentials first
2. Try restore with old credentials to confirm they work
3. Then attempt change again

**No Existing Backup**:

- Can't change if no backup exists
- Must create initial backup first
- Send encrypted message or Settings → Backup Now

**Network Issues**:

- Check connection
- Ensure Firestore accessible
- Retry after connection stabilizes

---

### Error Messages Explained

**"Password/passphrase may be incorrect"**

- PBKDF2 derived key doesn't match
- Decryption with AES-GCM failed
- Try different password/passphrase

**"Network error"**

- Firestore connection failed
- Check internet connection
- Retry after a moment

**"Backup not found"**

- No document at `accounts/{uid}/encryptionKeyBackup`
- Never backed up, or backup deleted
- Create new backup

**"Invalid backup format"**

- Backup document structure incorrect
- May be corrupted or from old version
- Try backup again, or contact support

**"Keys already exist locally"**

- Trying to generate/restore when keys present
- Clear local keys first if you want to replace

**"Permission denied"**

- Firestore Security Rules blocking access
- Verify logged in correctly
- Check account has proper permissions

---

## Frequently Asked Questions (FAQ)

### General Questions

**Q: Why do I need a separate passphrase if I use Google login?**

A: Google login doesn't give us access to your Google password (by design for security). A separate passphrase ensures your encrypted messages remain secure and only accessible by you. This is a fundamental security principle: your encryption keys should be protected by credentials only you know, not credentials shared with third parties (even Google).

**Q: Can someone at the company read my encrypted messages?**

A: No. Your private keys are encrypted with your password/passphrase before being stored. We only store the encrypted version. Even with database access, messages are unreadable without your password/passphrase. The encryption happens on your device (client-side), and we never see the plaintext keys or messages.

**Q: What happens if I change my login password?**

A: **Email/Password users** should update their encryption backup with the new password:

1. Settings → Encryption → Change Password
2. Enter old password (to decrypt current backup)
3. Enter new password (to re-encrypt backup)
4. Backup updated automatically

If you forget to do this, you'll be prompted the next time you try to backup or send an encrypted message.

**Q: Can I use the same passphrase on multiple accounts?**

A: While technically possible, we **strongly recommend** using unique passphrases for each account for better security. If one account is compromised, others remain secure. Use a passphrase manager to generate and store unique passphrases.

**Q: What encryption standard is used?**

A: We use industry-standard encryption:

- **Key Exchange**: RSA-OAEP-2048 (Optimal Asymmetric Encryption Padding)
- **Message Encryption**: AES-256-GCM (Advanced Encryption Standard, Galois/Counter Mode)
- **Key Derivation**: PBKDF2-SHA256 with 100,000 iterations (OWASP recommended)
- **Backup Encryption**: AES-256-GCM

**Q: Is this quantum-safe?**

A: No. Current encryption standards (RSA-2048, AES-256) are not quantum-resistant. However:

- AES-256 has partial quantum resistance (Grover's algorithm reduces effective key size to 128 bits, still secure)
- RSA-2048 is vulnerable to Shor's algorithm (future quantum computers)
- **Timeline**: Likely safe for next 10-15 years
- **Future Plans**: Monitor NIST post-quantum cryptography standards, plan migration to quantum-resistant algorithms (e.g., Kyber for key exchange, Dilithium for signatures)

**Q: Can I export my private key?**

A: No. Private keys are only stored:

1. Locally (unencrypted in localStorage, protected by device security)
2. Cloud backup (encrypted with your password/passphrase in Firestore)

This prevents unauthorized access and accidental exposure. If you need to move keys between devices, use the backup/restore feature.

### Technical Questions

**Q: Why 100,000 PBKDF2 iterations?**

A: This is the OWASP recommended minimum for 2023-2024. It balances security and performance:

- **Security**: Makes brute-force attacks computationally expensive (~15-20 seconds per attempt)
- **Performance**: Tolerable delay for legitimate users during backup/restore
- **Scaling**: As computers get faster, we'll increase iterations (planned: 310,000 for 2025+)

**Q: What's the difference between password and passphrase?**

A: In this context:

- **Password**: For email/password users, the Firebase authentication password (also used for encryption)
- **Passphrase**: For SSO users, a separate credential specifically for encryption (not used for login)

Technically, both undergo the same PBKDF2 + AES-GCM process.

**Q: Why is the public key stored unencrypted?**

A: Public keys are designed to be public (hence the name). They can only encrypt data, not decrypt it. Storing them unencrypted:

- Allows easy key exchange without decryption
- Enables key fingerprint verification
- Poses no security risk (private key remains encrypted)

**Q: What happens if Firestore is compromised?**

A: Even with full database access, an attacker cannot:

1. Decrypt your private key (requires password/passphrase)
2. Read encrypted messages (requires private key)
3. Brute-force the password (100,000 PBKDF2 iterations + 5-minute lockout)

Attacker could:

1. Delete backups (availability impact, not confidentiality)
2. See metadata (who you message, when, not content)

**Q: Can I use this in incognito/private mode?**

A: Yes, but with limitations:

- Keys stored in session-only localStorage (deleted when closing browser)
- Must restore from backup each session
- Can backup normally
- Good for temporary/shared devices

**Q: What data is stored in localStorage?**

A: For encryption feature:

- RSA public key (base64 encoded, SPKI format)
- RSA private key (base64 encoded, PKCS#8 format)
- Lockout timer (failed attempts, locked until timestamp)

All cleared on logout or manual clear.

**Q: Why not use IndexedDB instead of localStorage?**

A: Good question! We're considering this for future versions:

- **Pros**: Larger storage limits, structured data, better performance
- **Cons**: More complex API, similar security model to localStorage
- **Current**: localStorage sufficient for key pair storage (~2-4 KB)

### Usage Questions

**Q: Can I have different keys on different devices?**

A: Technically yes, but **not recommended**:

- Messages encrypted on Device A (Key A) can't be decrypted on Device B (Key B)
- Creates fragmented message history
- Use backup/restore to sync same keys across devices

**Q: How do I know if my messages are encrypted?**

A: Look for encryption indicators:

- 🔒 Lock icon next to encrypted messages
- "Encrypted" badge in chat header when encryption enabled
- Settings → Encryption shows encryption status

**Q: Can I disable encryption after enabling it?**

A: Yes:

- Settings → Encryption → Clear Local Keys (removes from current device)
- Generate New Keys and don't enable encryption for new chats
- Old encrypted messages remain encrypted (permanently)

**Q: What happens if I delete my account?**

A: All data deleted:

- Firestore backup deleted (`accounts/{uid}` document)
- Local keys cleared on logout
- Messages remain encrypted in chat history (other participants can't decrypt without your public key)

**Q: Can I backup to a file instead of cloud?**

A: Not currently supported. Future enhancement planned:

- Export encrypted backup to JSON file
- Import backup from file on new device
- Useful for offline backup or maximum control

### Troubleshooting Questions

**Q: Why am I seeing "Key fingerprint mismatch"?**

A: This error occurs when trying to decrypt a message with the wrong key. Causes:

- Keys regenerated after message was encrypted
- Restoring backup from different user/account
- Message encrypted for different recipient

Solution: Ensure using same keys as when message was sent.

**Q: Why does restore take 15-20 seconds?**

A: PBKDF2 with 100,000 iterations is intentionally slow (security feature):

- Makes brute-force attacks computationally expensive
- Legitimate users experience one-time delay during restore
- Faster devices (newer CPUs) complete faster

Normal and expected behavior.

**Q: Can support help if I forget my passphrase?**

A: No. By design:

- Support doesn't have access to your passphrase (never sent to server)
- Support can't decrypt your backup (requires passphrase)
- Support can't recover old messages

Support can:

- Help you generate new keys (lose old messages)
- Verify backup exists in database
- Troubleshoot technical issues (errors, bugs)

**Q: What if my device is stolen?**

A: Immediate actions:

1. Change password/passphrase from another device (Settings → Encryption → Change Password)
2. This re-encrypts backup with new credentials
3. Stolen device still has old keys, but can't access new backups
4. Consider generating new keys if keys on stolen device are compromised
5. Enable 2FA on your account to prevent unauthorized access

**Q: Can I have multiple backups?**

A: No, only one backup per user in Firestore:

- Each backup overwrites previous
- No versioning or history
- Use export feature (future enhancement) for multiple backups

---

## Implementation Details (Technical Reference)

### File Structure

```
src/app/
├── modules/messaging/
│   ├── services/
│   │   ├── encryption.service.ts        # Core crypto operations
│   │   ├── key-backup.service.ts        # Backup/restore logic
│   │   ├── encrypted-chat.service.ts    # E2EE message handling
│   │   └── secure-key-storage.service.ts # IndexedDB key storage
│   └── components/
│       ├── encryption-passphrase-modal/ # SSO passphrase setup
│       ├── key-restore-modal/           # Restore flow UI
│       └── encryption-settings/         # Settings page
├── state/effects/
│   └── auth.effects.ts                  # Password capture
└── shared/models/
    └── account.model.ts                 # EncryptionKeyBackup interface
```

### Service Methods

**EncryptionService**:

- `generateKeyPair()` → KeyPair (RSA-2048)
- `generateMessageKey()` → CryptoKey (AES-256)
- `encryptMessage(content, key)` → EncryptedMessage
- `decryptMessage(encrypted, key)` → string
- `deriveKeyFromPassword(password, salt, iterations)` → CryptoKey
- `encryptWithDerivedKey(data, key)` → {encryptedData, iv}
- `decryptWithDerivedKey(encrypted, key, iv)` → string
- `getPublicKeyFingerprint(publicKey)` → string

**KeyBackupService**:

- `capturePasswordOnLogin(password)` → void
- `getAuthMethod()` → 'password' | 'sso'
- `promptForPassphrase()` → Promise<string>
- `backupKeys(passwordOrPassphrase, keyPair)` → Promise<void>
- `restoreKeys(passwordOrPassphrase)` → Promise<KeyPair>
- `changePassword(old, new)` → Promise<void>
- `hasBackup()` → Promise<boolean>

### Component Integration

**EncryptionPassphraseModalComponent**:

- Input: None
- Output: passphrase (string | null)
- Validation: ReactiveFormsModule with custom validators
- Usage: Presented on first encrypted message (SSO users)

**KeyRestoreModalComponent**:

- Input: authMethod ('password' | 'sso')
- Output: keyPair (KeyPair | null)
- Features: Lockout timer, attempt counter, generate new option
- Usage: New device, or manual restore from settings

**EncryptionSettingsComponent**:

- Standalone page or modal
- Shows backup status, last backup, local keys
- Actions: backup, restore, change, generate, clear
- Integrates with KeyBackupService and EncryptionService

---

## Support & Resources

### Getting Help

**In-App Help**:

- Settings → Encryption → Help section
- Contextual help in modals (restore, passphrase)
- Error messages with suggested actions

**Documentation**:

- This User Guide (comprehensive reference)
- [Technical Implementation Guide](/docs/ENCRYPTION_BACKUP_IMPLEMENTATION.md)
- [Security Review](/docs/ENCRYPTION_SECURITY_REVIEW.md)

**Support Channels**:

1. Check this guide first (search for error message)
2. In-app support ticket (Settings → Support)
3. Email: support@ascendcoopplatform.org
4. Include:
   - Specific error message (exact text)
   - Device type and OS version
   - Browser/app version
   - Steps to reproduce issue
   - **Never include password/passphrase**

### What Support Can and Cannot Do

**Support Can**:

- ✅ Help troubleshoot technical errors
- ✅ Verify backup exists in Firestore
- ✅ Check Firestore security rules
- ✅ Guide you through UI/process
- ✅ Help generate new keys (lose old messages)
- ✅ Assist with account access issues

**Support Cannot**:

- ❌ Recover lost password/passphrase
- ❌ Decrypt your backup
- ❌ Read your encrypted messages
- ❌ Bypass 5-minute lockout
- ❌ Restore old messages after generating new keys
- ❌ Merge key pairs from different backups

### Security Disclosure

**Found a Security Issue?**

Please report responsibly:

1. **Do NOT** post publicly (GitHub issues, social media)
2. Email: security@ascendcoopplatform.org
3. Include:
   - Detailed description of vulnerability
   - Steps to reproduce (proof of concept)
   - Potential impact assessment
   - Your contact info for follow-up
4. We'll respond within 48 hours
5. Fix coordinated disclosure after patch released

**Rewards**: We appreciate responsible disclosure and may offer recognition or rewards for significant findings.

---

## Version History

**v1.0** (December 2025) - Initial Release

- Core backup/restore functionality
- Email/password auto-backup
- SSO passphrase setup
- PBKDF2 (100k iterations) + AES-256-GCM
- Brute-force protection (3 attempts, 5-min lockout)
- Encryption settings UI

**Planned Features** (Future Versions):

- v1.1: Increased PBKDF2 iterations (310k)
- v1.2: Export/import backup to file
- v1.3: Multiple backup versions
- v2.0: Signal Protocol (Double Ratchet) for forward secrecy
- v3.0: Post-quantum cryptography (Kyber, Dilithium)

---

## Quick Reference Card

### Email/Password Users

| Action                      | Steps                                                     |
| --------------------------- | --------------------------------------------------------- |
| **First Encrypted Message** | Send message → Auto-backup with login password            |
| **New Device**              | Login → Auto-restore → Done                               |
| **Change Password**         | Settings → Encryption → Change Password → Enter old & new |
| **Forgot Password**         | Use Firebase password reset → Update backup after reset   |

### SSO Users (Google, etc.)

| Action                      | Steps                                                       |
| --------------------------- | ----------------------------------------------------------- |
| **First Encrypted Message** | Send message → Modal appears → Set passphrase (8+ chars)    |
| **New Device**              | Login → Modal appears → Enter passphrase → Restore          |
| **Change Passphrase**       | Settings → Encryption → Change Passphrase → Enter old & new |
| **Forgot Passphrase**       | Generate New Keys (lose old messages)                       |

### Emergency Actions

| Situation            | Action                                                            |
| -------------------- | ----------------------------------------------------------------- |
| **Device Stolen**    | Change password/passphrase immediately → Re-encrypt backup        |
| **Keys Compromised** | Generate new keys → Inform contacts → Exchange new public keys    |
| **Account Hacked**   | Change password → Enable 2FA → Review activity                    |
| **Can't Restore**    | Verify password/passphrase → Check attempts left → Wait if locked |
| **Lost Password**    | Firebase reset (email/password) OR Generate new keys (SSO)        |

### Common Error Fixes

| Error                      | Fix                                                               |
| -------------------------- | ----------------------------------------------------------------- |
| **"No backup found"**      | Send encrypted message OR Settings → Backup Now                   |
| **"Incorrect password"**   | Try old password if changed recently → Update backup              |
| **"Locked for 5 minutes"** | Wait for timer → 3 attempts max → Timer persists across refreshes |
| **"Failed to restore"**    | Check internet → Verify password → Try again                      |
| **"Keys not found"**       | Restore from backup OR Generate new keys                          |

---

**Last Updated**: December 21, 2025
**Document Version**: 2.0 (Comprehensive Edition)
**Feature Status**: ✅ Implemented & Tested
