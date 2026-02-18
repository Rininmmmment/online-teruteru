import { TeruTeruBozu } from '../models/TeruTeruBozu';

export interface ITeruTeruBozuRepository {
    save(bozu: TeruTeruBozu): Promise<TeruTeruBozu>;
    findLatest(limit: number): Promise<TeruTeruBozu[]>;
    findById(id: number): Promise<TeruTeruBozu | null>;
}
