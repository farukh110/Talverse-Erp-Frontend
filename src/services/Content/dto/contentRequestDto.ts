export interface ContentRequestDto {
     ComponentIdOrName:string,
     Parameters?:any[]
}

export interface SavedRequestDto {
     tableName:string,
     translationTableName?:string,
     Parameters?:any[]
}