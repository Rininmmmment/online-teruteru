import { ITeruTeruBozuRepository } from '../../domain/repositories/ITeruTeruBozuRepository';
import { TeruTeruBozu } from '../../domain/models/TeruTeruBozu';

export class GetTeruTeruBozuUseCase {
    constructor(private repository: ITeruTeruBozuRepository) { }

    async execute(id: number): Promise<TeruTeruBozu | null> {
        return await this.repository.findById(id);
    }
}
