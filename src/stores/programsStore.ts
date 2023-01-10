import { EntityDto } from '../services/dto/entityDto';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import programsService from '../services/programs/programsService';
import { store } from 'react-context-hook';
import { PagedFilterAndSortedRequest } from '../services/dto/pagedFilterAndSortedRequest';

import {
    CreateOrUpdateProgramInput,
    UpdateProgramInput,
    GetProgramOutput
} from '../services/programs/dto/programsDto';

class ProgramsStore {
    programs!: PagedResultDto<GetProgramOutput>;
    editProgram!: CreateOrUpdateProgramInput;

    static AppStateKeys = {
        PROGRAMS: "programs",
        EDIT_PROGRAM: "editPrograms"
    }
    async create(createProgramInput: CreateOrUpdateProgramInput) {
        let result = await programsService.create(createProgramInput);
        this.programs.items.push(result);
    }
    async update(updateProgramInput: UpdateProgramInput) {
        let result = await programsService.update(updateProgramInput);
        this.programs.items = this.programs.items.map((x: GetProgramOutput) => {
            if (x.id === updateProgramInput.id) {
                console.log(result);
                x = result;
            }
            return x;
        });
    }

    async delete(entityDto: EntityDto) {
        await programsService.delete(entityDto);
        this.programs.items = this.programs.items.filter((x: GetProgramOutput) => x.id !== entityDto.id);
    }

    async get(entityDto: EntityDto) {
        let result = await programsService.get(entityDto);
        this.editProgram = result;
        store.set(ProgramsStore.AppStateKeys.EDIT_PROGRAM, result);
    }

    async createPrograms() {
        this.editProgram = {

            id: 0,
            name: '',
            childProgram: {
                id: 0,
                name: '',
                products: [
                    {
                        id: 0,
                        amount: 0,
                        code: '',
                        name: '',
                        formId: '',
                        unitNameSingular: '',
                        unitNamePlural: ''
                    }
                ]
            },
            products: [
                {
                    id: 0,
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
                    name: '',
                    description: '',
                    language: ''
                }
            ]

        };

        store.set(ProgramsStore.AppStateKeys.EDIT_PROGRAM, this.editProgram)
    }

    // get all programs 
    async getAllPrograms(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest) {
        let result = await programsService.getAllPrograms(pagedFilterAndSortedRequest);
        this.programs = result;
        store.set(ProgramsStore.AppStateKeys.PROGRAMS, result);
        return result;
    }

    async getAllCSVData() {
        let result = await programsService.getAllPrograms({
            maxResultCount: 300000,
            skipCount: 0,
            keyword: "",
            sorting: "name"
        });
        return result.items;
    }

    async changeLanguage(languageName: string) {
        await programsService.changeLanguage({ languageName: languageName });
    }
}

export default ProgramsStore;
