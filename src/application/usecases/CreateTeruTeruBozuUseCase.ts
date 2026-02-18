import { ITeruTeruBozuRepository } from '../../domain/repositories/ITeruTeruBozuRepository';
import { TeruTeruBozu, TeruTeruBozuType } from '../../domain/models/TeruTeruBozu';

export class CreateTeruTeruBozuUseCase {
    constructor(private repository: ITeruTeruBozuRepository) { }

    async execute(date: string, memo: string, type: TeruTeruBozuType, prefecture: string = '東京都'): Promise<TeruTeruBozu> {
        // 1. Create Domain Entity
        const bozu = TeruTeruBozu.create(date, memo, type, prefecture);

        // 2. Save using Repository
        return await this.repository.save(bozu);
    }
}
