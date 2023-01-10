// Create Or Update Program Input
export interface CreateOrUpdateProgramInput {

    id: number,
    name: string,
    childProgram: {
        id: number,
        name: string,
        products: [
            {
                id: number,
                amount: number,
                code: string,
                name: string,
                formId: string,
                unitNameSingular: string,
                unitNamePlural: string
            }
        ]
    },
    products: [
        {
            id: number,
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
            name: string,
            description: string,
            language: string
        }
    ]
}

// Create Program Input  
export interface CreateProgramInput {

    id: number,
    name: string,
    childProgram: {
        id: number,
        name: string,
        products: [
            {
                id: number,
                amount: number,
                code: string,
                name: string,
                formId: string,
                unitNameSingular: string,
                unitNamePlural: string
            }
        ]
    },
    products: [
        {
            id: number,
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
            name: string,
            description: string,
            language: string
        }
    ]
}

// Create Program Output Item
export interface CreateProgramOutputItem {

    id: number,
    name: string,
    childProgram: {
        id: number,
        name: string,
        products: [
            {
                id: number,
                amount: number,
                code: string,
                name: string,
                formId: string,
                unitNameSingular: string,
                unitNamePlural: string
            }
        ]
    },
    products: [
        {
            id: number,
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
            name: string,
            description: string,
            language: string
        }
    ]
}

// Create Program Output  
export interface CreateProgramOutput {
    result: CreateProgramOutputItem;
}

// GetAll Program Output    
export interface GetAllProgramOutput {

    id: number,
    name: string,
    childProgram: {
        id: number,
        name: string,
        products: [
            {
                id: number,
                amount: number,
                code: number,
                name: string,
                formId: number,
                unitName: string,
                unitNameSingular: string,
                unitNamePlural: string
            }
        ]
    },
    products: [
        {
            id: number,
            amount: number,
            code: string,
            name: string,
            formId: number,
            unitName: string,
            unitNameSingular: string,
            unitNamePlural: string
        }
    ],
    translations: [
        {
            id: number,
            name: string,
            description: string,
            language: string
        }
    ]
}

// Get Program Output
export interface GetProgramOutput {

    id: number,
    name: string,
    childProgram: {
        id: number,
        name: string,
        products: [
            {
                id: number,
                amount: number,
                code: number,
                name: string,
                formId: number,
                unitName: string,
                unitNameSingular: string,
                unitNamePlural: string
            }
        ]
    },
    products: [
        {
            id: number,
            amount: number,
            code: string,
            name: string,
            formId: number,
            unitName: string,
            unitNameSingular: string,
            unitNamePlural: string
        }
    ],
    translations: [
        {
            id: number,
            name: string,
            description: string,
            language: string
        }
    ]
}

// Update Program Input
export interface UpdateProgramInput {

    id: number,
    name: string,
    childProgram: {
        id: number,
        name: string,
        products: [
            {
                id: number,
                amount: number,
                code: string,
                name: string,
                formId: string,
                unitNameSingular: string,
                unitNamePlural: string
            }
        ]
    },
    products: [
        {
            id: number,
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
            name: string,
            description: string,
            language: string
        }
    ]

}

// Update Program Output
export interface UpdateProgramOutput {

    id: number,
    name: string,
    childProgram: {
        id: number,
        name: string,
        products: [
            {
                id: number,
                amount: number,
                code: string,
                name: string,
                formId: string,
                unitNameSingular: string,
                unitNamePlural: string
            }
        ]
    },
    products: [
        {
            id: number,
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
            name: string,
            description: string,
            language: string
        }
    ]

}