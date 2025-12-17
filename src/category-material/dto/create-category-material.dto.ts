import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCategoryMaterialDto {
    
    @IsNotEmpty()
    @IsString()
    name:string


    @IsUUID()
    @IsOptional()
    existingMaterialIds?: string[]

    @IsOptional()
    newMaterials?: { name:string}[]
}
