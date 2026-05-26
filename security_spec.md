# Security Spec

## Data Invariants
1. `users`: A user can only read/write their own profile UNLESS they are an admin.
2. `notices`: Admins can CRUD. Students/Teachers can only read.
3. `admissions`: Anyone (even anonymous or unverified) can `create` an admission. Only Admins can `read`, `update` or `delete`. 
4. `achievements`: Admins can CRUD. Anyone can read.

## Dirty Dozen Payloads
1. Create admission with `status` = 'Admitted' (bypassing 'New').
2. non-admin updates `notices/docId` with new content.
3. User reads `admissions` list.
4. User updates their own `role` in `users` to 'admin'.
5. etc.
