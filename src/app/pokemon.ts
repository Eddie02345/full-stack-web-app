import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface PokemonEntry {
  _id?: string;
  name: string;
  type: string;
  level: number;
  nature: string;
}

@Injectable({
  providedIn: 'root'
})
export class Pokemon {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/pokemon';

  // Reactive state management using signals
  pokemonList = signal<PokemonEntry[]>([]);

  fetchPokemon() {
    this.http.get<PokemonEntry[]>(this.apiUrl).subscribe({
      next: (data) => this.pokemonList.set(data),
      error: (err) => console.error('Error fetching pokemon:', err)
    });
  }

  savePokemon(data: Omit<PokemonEntry, '_id'>) {
    return this.http.post<PokemonEntry>(this.apiUrl, data);
  }

  updatePokemon(id: string, data: Omit<PokemonEntry, '_id'>) {
    return this.http.put<PokemonEntry>(`${this.apiUrl}/${id}`, data);
  }

  deletePokemon(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}