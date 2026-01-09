export interface IStateItem {
    field: string;
    region: string;
}

export interface IMovieGenre {
    type: string;
    movies: string[];
}

export interface IFalsyData {
    field: string;
    value: any; 
}

export interface IComboUserForm {
    date: string;
    dateTime: string;
    email: string;
    fullName: string;
    genres: string[];
    movie: string;
    phone: string;
}