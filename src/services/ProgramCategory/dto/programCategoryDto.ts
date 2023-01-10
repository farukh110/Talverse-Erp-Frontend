// Create Or Update Program Category Input
export interface CreateOrUpdateProgramCategoryInput {

    id: number,
    appId: number,
    name: string,
    isActive: true,
    displayOrder: number,
    translations: [
        {
            id: number,
            appId: number,
            name: string,
            description: string,
            language: string
        }
    ],
    programs: [
        {
            id: number,
            appId: number,
            name: string,
            childProgram: {
                id: number,
                appId: number,
                name: string,
                childProgram: string,
                products: [
                    {
                        id: number,
                        appId: number,
                        amount: number,
                        code: string,
                        name: string,
                        formId: number,
                        unitNameSingular: string,
                        unitNamePlural: string
                    }
                ]
            },
            products: [
                {
                    id: number,
                    appId: number,
                    amount: number,
                    code: string,
                    name: string,
                    formId: number,
                    unitNameSingular: string,
                    unitNamePlural: string
                }
            ],
            translations: [
                {
                    id: number,
                    appId: number,
                    name: string,
                    description: string,
                    language: string
                }
            ]
        }
    ]
}

// Create Program Category Input  
export interface CreateProgramCategoryInput {

    id: number,
    appId: number,
    name: string,
    isActive: true,
    displayOrder: number,
    translations: [
        {
            id: number,
            appId: number,
            name: string,
            description: string,
            language: string
        }
    ],
    programs: [
        {
            id: number,
            appId: number,
            name: string,
            childProgram: {
                id: number,
                appId: number,
                name: string,
                childProgram: string,
                products: [
                    {
                        id: number,
                        appId: number,
                        amount: number,
                        code: string,
                        name: string,
                        formId: number,
                        unitNameSingular: string,
                        unitNamePlural: string
                    }
                ]
            },
            products: [
                {
                    id: number,
                    appId: number,
                    amount: number,
                    code: string,
                    name: string,
                    formId: number,
                    unitNameSingular: string,
                    unitNamePlural: string
                }
            ],
            translations: [
                {
                    id: number,
                    appId: number,
                    name: string,
                    description: string,
                    language: string
                }
            ]
        }
    ]
}

// Create Program Category Output Item
export interface CreateProgramCategoryOutputItem {

    id: number,
    appId: number,
    name: string,
    isActive: true,
    displayOrder: number,
    programs: [
        {
            id: number,
            appId: number,
            name: string,
            childProgram: string,
            products: [
                {
                    id: number,
                    appId: number,
                    amount: number,
                    code: string,
                    name: string,
                    formId: number,
                    unitName: string,
                    unitNameSingular: string,
                    unitNamePlural: string
                }
            ]
        }
    ]
}

// Create Program Category Output  
export interface CreateProgramCategoryOutput {
    result: CreateProgramCategoryOutputItem;
}

// GetAll Program Category Output    
export interface GetAllProgramCategoryOutput {

    id: number,
    appId: number,
    name: string,
    isActive: true,
    displayOrder: number,
    programs: [
        {
            id: number,
            appId: number,
            name: string,
            childProgram: string,
            products: [
                {
                    id: number,
                    appId: number,
                    amount: number,
                    code: string,
                    name: string,
                    formId: number,
                    unitName: string,
                    unitNameSingular: string,
                    unitNamePlural: string
                }
            ]
        }
    ]
}

// Get Program Category Output
export interface GetProgramCategoryOutput {

    id: number,
    appId: number,
    name: string,
    isActive: true,
    displayOrder: number,
    programs: [
        {
            id: number,
            appId: number,
            name: string,
            childProgram: string,
            products: [
                {
                    id: number,
                    appId: number,
                    amount: number,
                    code: string,
                    name: string,
                    formId: number,
                    unitName: string,
                    unitNameSingular: string,
                    unitNamePlural: string
                }
            ]
        }
    ]
}

// Update Program Category Input
export interface UpdateProgramCategoryInput {

    id: number,
    appId: number,
    name: string,
    isActive: true,
    displayOrder: number,
    translations: [
        {
            id: number,
            appId: number,
            name: string,
            description: string,
            language: string
        }
    ],
    programs: [
        {
            id: number,
            appId: number,
            name: string,
            childProgram: {
                id: number,
                appId: number,
                name: string,
                childProgram: string,
                products: [
                    {
                        id: number,
                        appId: number,
                        amount: number,
                        code: string,
                        name: string,
                        formId: number,
                        unitNameSingular: string,
                        unitNamePlural: string
                    }
                ]
            },
            products: [
                {
                    id: number,
                    appId: number,
                    amount: number,
                    code: string,
                    name: string,
                    formId: number,
                    unitNameSingular: string,
                    unitNamePlural: string
                }
            ],
            translations: [
                {
                    id: number,
                    appId: number,
                    name: string,
                    description: string,
                    language: string
                }
            ]
        }
    ]
}

// Update Program Category Output
export interface UpdateProgramCategoryOutput {

    id: number,
    appId: number,
    name: string,
    isActive: true,
    displayOrder: number,
    translations: [
        {
            id: number,
            appId: number,
            name: string,
            description: string,
            language: string
        }
    ],
    programs: [
        {
            id: number,
            appId: number,
            name: string,
            childProgram: {
                id: number,
                appId: number,
                name: string,
                childProgram: string,
                products: [
                    {
                        id: number,
                        appId: number,
                        amount: number,
                        code: string,
                        name: string,
                        formId: number,
                        unitNameSingular: string,
                        unitNamePlural: string
                    }
                ]
            },
            products: [
                {
                    id: number,
                    appId: number,
                    amount: number,
                    code: string,
                    name: string,
                    formId: number,
                    unitNameSingular: string,
                    unitNamePlural: string
                }
            ],
            translations: [
                {
                    id: number,
                    appId: number,
                    name: string,
                    description: string,
                    language: string
                }
            ]
        }
    ]
}