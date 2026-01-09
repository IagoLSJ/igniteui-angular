import { Injectable } from '@angular/core';
import { IStateItem, IMovieGenre } from '../models/combo-models';

@Injectable({ providedIn: 'root' })
export class ComboDataService {
    public getGenres(): IMovieGenre[] {
        return [
            { type: 'Action', movies: ['The Matrix', 'Kill Bill: Vol.1', 'The Dark Knight Rises'] },
            { type: 'Adventure', movies: ['Interstellar', 'Inglourious Basterds', 'Inception'] },
            { type: 'Comedy', movies: ['Wild Tales', 'In Bruges', 'Three Billboards Outside Ebbing, Missouri', 'Untouchable', '3 idiots'] },
    { type: 'Crime', movies: ['Training Day', 'Heat', 'American Gangster'] },
    { type: 'Drama', movies: ['Fight Club', 'A Beautiful Mind', 'Good Will Hunting', 'City of God'] },
    { type: 'Biography', movies: ['Amadeus', 'Bohemian Rhapsody'] },
    { type: 'Mystery', movies: ['The Prestige', 'Memento', 'Cloud Atlas'] },
    { type: 'Musical', movies: ['All That Jazz'] },
    { type: 'Romance', movies: ['Love Actually', 'In The Mood for Love'] },
    { type: 'Sci-Fi', movies: ['The Fifth Element'] },
    { type: 'Thriller', movies: ['The Usual Suspects'] },
    { type: 'Western', movies: ['Django Unchained'] },
        ];
    }

    public getStates(): IStateItem[] {
        const division: Record<string, string[]> = {
            'Pacific 01': ['Alaska', 'California'],
            'New England 01': ['Connecticut', 'Maine', 'Massachusetts'],
    'New England 02': ['New Hampshire', 'Rhode Island', 'Vermont'],
    'Mid-Atlantic': ['New Jersey', 'New York', 'Pennsylvania'],
    'East North Central 02': ['Michigan', 'Ohio', 'Wisconsin'],
    'East North Central 01': ['Illinois', 'Indiana'],
    'West North Central 01': ['Missouri', 'Nebraska', 'North Dakota', 'South Dakota'],
    'West North Central 02': ['Iowa', 'Kansas', 'Minnesota'],
    'South Atlantic 01': ['Delaware', 'Florida', 'Georgia', 'Maryland'],
    'South Atlantic 02': ['North Carolina', 'South Carolina', 'Virginia'],
    'South Atlantic 03': ['District of Columbia', 'West Virginia'],
    'East South Central 01': ['Alabama', 'Kentucky'],
    'East South Central 02': ['Mississippi', 'Tennessee'],
    'West South Central': ['Arkansas', 'Louisiana', 'Oklahome', 'Texas'],
    'Mountain': ['Arizona', 'Colorado', 'Idaho', 'Montana', 'Nevada', 'New Mexico', 'Utah', 'Wyoming'],
    
    'Pacific 02': ['Hawaii', 'Oregon', 'Washington'],
        };
        
        return Object.keys(division).flatMap(key => 
            division[key].map(state => ({
                field: state,
                region: key.replace(/\s\d+$/, '')
            }))
        );
    }
}
