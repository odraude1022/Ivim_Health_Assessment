import { IsDefined, IsString } from "class-validator";
import { Expose } from "class-transformer";

export class CreateNote {
    @IsDefined()
    @IsString()
    @Expose()
    title: string

    @IsDefined()
    @IsString()
    @Expose()
    description: string
}

export class UpdateNote {
    @IsDefined()
    @IsString()
    @Expose()
    title: string

    @IsDefined()
    @IsString()
    @Expose()
    description: string
}
