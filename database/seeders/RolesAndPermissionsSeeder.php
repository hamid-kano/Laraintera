<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // مسح الكاش
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // ── Permissions ───────────────────────────────
        $permissions = [
            // المنتجات
            'view-products',
            'create-products',
            'edit-products',
            'delete-products',

            // الطلبات
            'view-own-orders',
            'view-all-orders',
            'update-order-status',

            // المستخدمون
            'view-users',
            'edit-users',

            // لوحة التحكم
            'access-admin',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // ── Roles ─────────────────────────────────────

        // Admin — كل الصلاحيات
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->syncPermissions($permissions);

        // Customer — صلاحيات محدودة
        $customer = Role::firstOrCreate(['name' => 'customer']);
        $customer->syncPermissions([
            'view-products',
            'view-own-orders',
        ]);

        // ── تعيين الأدوار للمستخدمين ──────────────────

        // المستخدم الأول = admin
        $adminUser = User::first();
        if ($adminUser) {
            $adminUser->assignRole('admin');
        }

        // باقي المستخدمين = customers
        User::skip(1)->each(fn($user) => $user->assignRole('customer'));

        // إنشاء admin مخصص إذا لم يكن موجوداً
        $adminEmail = 'admin@store.com';
        if (! User::where('email', $adminEmail)->exists()) {
            $newAdmin = User::create([
                'name'     => 'Admin',
                'email'    => $adminEmail,
                'password' => bcrypt('password'),
            ]);
            $newAdmin->assignRole('admin');
        }
    }
}
