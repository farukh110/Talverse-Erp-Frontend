import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import programCategoryService from '../services/ProgramCategory/programCategoryService';
import { store } from 'react-context-hook';
import { PagedFilterAndSortedRequest } from '../services/dto/pagedFilterAndSortedRequest';

import {
    CreateOrUpdateProgramCategoryInput,
    GetProgramCategoryOutput,
    UpdateProgramCategoryInput
} from '../services/ProgramCategory/dto/programCategoryDto';

class ProgramCategoryStore {
    programsCategory!: PagedResultDto<GetProgramCategoryOutput>;
    editProgramsCategory!: CreateOrUpdateProgramCategoryInput;

    static AppStateKeys = {
        PROGRAMS_CATEGORY: "programsCategory",
        EDIT_PROGRAM_CATEGORY: "editProgramsCategory"
    }
    async create(createProgramCategoryInput: CreateOrUpdateProgramCategoryInput) {
        let result = await programCategoryService.create(createProgramCategoryInput);
        this.programsCategory.items.push(result);
    }
    async update(updateProgramCategoryInput: UpdateProgramCategoryInput) {
        let result = await programCategoryService.update(updateProgramCategoryInput);
        this.programsCategory.items = this.programsCategory.items.map((x: GetProgramCategoryOutput) => {
            if (x.id === updateProgramCategoryInput.id) {
                console.log(result);
                x = result;
            }
            return x;
        });
    }

    async delete(entityDto: EntityDto) {
        await programCategoryService.delete(entityDto);
        this.programsCategory.items = this.programsCategory.items.filter((x: GetProgramCategoryOutput) => x.id !== entityDto.id);
    }

    async get(entityDto: EntityDto) {
        let result = await programCategoryService.get(entityDto);
        this.editProgramsCategory = result;
        store.set(ProgramCategoryStore.AppStateKeys.EDIT_PROGRAM_CATEGORY, result);
    }

    async createPrograms() {
        this.editProgramsCategory = {

            id: 0,
            appId: 0,
            name: '',
            isActive: true,
            displayOrder: 0,
            translations: [
                {
                    id: 0,
                    appId: 0,
                    name: '',
                    description: '',
                    language: ''
                }
            ],
            programs: [
                {
                    id: 0,
                    appId: 0,
                    name: '',
                    childProgram: {
                        id: 0,
                        appId: 0,
                        name: '',
                        childProgram: '',
                        products: [
                            {
                                id: 0,
                                appId: 0,
                                amount: 0,
                                code: '',
                                name: '',
                                formId: 0,
                                unitNameSingular: '',
                                unitNamePlural: ''
                            }
                        ]
                    },
                    products: [
                        {
                            id: 0,
                            appId: 0,
                            amount: 0,
                            code: '',
                            name: '',
                            formId: 0,
                            unitNameSingular: '',
                            unitNamePlural: ''
                        }
                    ],
                    translations: [
                        {
                            id: 0,
                            appId: 0,
                            name: '',
                            description: '',
                            language: ''
                        }
                    ]
                }
            ]
        };

        store.set(ProgramCategoryStore.AppStateKeys.EDIT_PROGRAM_CATEGORY, this.editProgramsCategory)
    }

    // get all programs Category 
    async getAllProgramCategory(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {
        let result = await programCategoryService.getAllProgramCategory(pagedFilterAndSortedRequest);
        this.programsCategory = result;
        store.set(ProgramCategoryStore.AppStateKeys.PROGRAMS_CATEGORY, result);
        return result;
    }

    async getAllCSVData() {
        let result = await programCategoryService.getAllProgramCategory({
            maxResultCount: 300000,
            skipCount: 0,
            keyword: "",
            sorting: "name"
        });
        return result.items;
    }

    async changeLanguage(languageName: string) {
        await programCategoryService.changeLanguage({ languageName: languageName });
    }
}

export default ProgramCategoryStore;
