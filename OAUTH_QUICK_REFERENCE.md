# OAuth Quick Reference for Google Cloud Console

Use these exact URLs when configuring your Google OAuth credentials.

## Required URLs for Google Cloud Console

### Authorized JavaScript Origins

Add these to **Authorized JavaScript origins**:

**Development:**
```
http://localhost:3000
```

**Production** (replace with your actual domain):
```
https://blog.ryanlongo.net
```

### Authorized Redirect URIs

Add these to **Authorized redirect URIs**:

**Supabase Callback** (REQUIRED - find this in Supabase Dashboard → Auth → Providers → Google):
```
https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
```

Example:
```
https://abcdefghijklmnop.supabase.co/auth/v1/callback
```

## Required URLs for Supabase Dashboard

Navigate to: **Settings** → **URL Configuration**

### Site URL

**Development:**
```
http://localhost:3000
```

**Production:**
```
https://blog.ryanlongo.net
```

### Redirect URLs

Add these under **Redirect URLs** (comma-separated):

**Development:**
```
http://localhost:3000/admin/auth/callback
```

**Production:**
```
https://blog.ryanlongo.net/admin/auth/callback
```

## Legal Pages for OAuth Consent Screen

In Google Cloud Console → OAuth consent screen:

**Privacy Policy URL:**
```
https://blog.ryanlongo.net/privacy
```

**Terms of Service URL:**
```
https://blog.ryanlongo.net/terms
```

## Quick Setup Checklist

- [ ] Google Cloud Console:
  - [ ] Create OAuth client ID
  - [ ] Add JavaScript origins
  - [ ] Add Supabase callback URI
  - [ ] Add Privacy Policy URL
  - [ ] Add Terms of Service URL

- [ ] Supabase Dashboard:
  - [ ] Enable Google provider
  - [ ] Add Client ID
  - [ ] Add Client Secret
  - [ ] Set Site URL
  - [ ] Add Redirect URLs

- [ ] Add your user to users table:
  ```sql
  INSERT INTO public.users (id, email, created_at)
  SELECT id, email, created_at FROM auth.users WHERE email = 'your-gmail@gmail.com';
  ```

- [ ] Test login at: `/admin/login`

## Common Issues

**"redirect_uri_mismatch"**
→ The redirect URI in the error message doesn't match Google Cloud Console
→ Add the EXACT URI from the error to Google Cloud Console

**"You do not have admin access"**
→ Run the SQL query above to add your user to the users table

**"invalid_client"**
→ Client ID or Secret is wrong in Supabase
→ Copy again from Google Cloud Console (no extra spaces)

## URLs in This Project

- Homepage: `/`
- Admin Login: `/admin/login`
- OAuth Callback: `/admin/auth/callback`
- Privacy Policy: `/privacy`
- Terms of Service: `/terms`
- Forgot Password: `/admin/forgot-password`
- Reset Password: `/admin/reset-password`

---

**Note**: Replace `blog.ryanlongo.net` with your actual domain and `YOUR_PROJECT_ID.supabase.co` with your actual Supabase project URL.
