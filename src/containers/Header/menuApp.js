export const adminMenu = [
    {// Quản lý người dùng
        name: 'menu.admin.manage-user', menus: [
            {
                name: 'menu.admin.CRUD', link: '/system/user-manage'
                // subMenus: [
                //     { name: 'menu.system.system-administrator.user-manage', link: '/system/user-manage' },
                //     { name: 'menu.system.system-administrator.user-redux', link: '/system/user-redux' },
                // ]
            },
            {
                name: 'menu.admin.CRUD-REDUX', link: '/system/user-redux'

            },
            // {
            //     name: 'menu.admin.manage-admin', link: '/system/user-admin'

            // },
            {
                name: 'menu.admin.manage-doctor', link: '/system/manage-doctor'

            },
            {// Quản lý kế hoạch khám bệnh

                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
            },
            {
                name: 'menu.doctor.manage-patient', link: '/system/manage-patient-admin'
            },

        ]
    },
    {// Quản lý Phòng khám
        name: 'menu.admin.clinic', menus: [
            {
                name: 'menu.admin.manage-clinic', link: '/system/manage-clinic'

            },

        ]
    },
    {// Quản lý Chuyên Khoa
        name: 'menu.admin.specialty', menus: [
            {
                name: 'menu.admin.manage-specialty', link: '/system/manage-specialty'

            },
        ]
    },
    {// Quản lý Cẩm nang
        name: 'menu.admin.handbook', menus: [
            {
                name: 'menu.admin.manage-handbook', link: '/system/manage-handbook-admin'
            },

        ]
    },
    {// Quản lý goi kham
        name: 'menu.admin.parkage', menus: [
            {
                name: 'menu.admin.manage-parkage', link: '/system/manage-parkage-admin'
            },
            {
                name: 'menu.admin.manage-parkage-patient', link: '/system/manage-patient-parkage'
            },

        ]
    },
];

export const doctorMenu = [
    {// Quản lý kế hoạch khám bệnh
        name: 'menu.admin.manage-user',
        menus: [
            {
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
            },
            {
                name: 'menu.doctor.manage-patient', link: '/doctor/manage-patient'
            },
        ]
    },

];