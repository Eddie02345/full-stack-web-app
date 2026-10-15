import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pokemon, PokemonEntry } from '../pokemon';

@Component({
  selector: 'app-pokemon-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pokemon-form.html',
  styleUrl: './pokemon-form.css'
})
export class PokemonForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  pokemonService = inject(Pokemon);

  // Tracks the _id of the item being edited; null when creating
  editingId = signal<string | null>(null);

  pokemonForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    level: [1, [Validators.required, Validators.min(1)]],
    nature: ['', Validators.required]
  });

  ngOnInit() {
    this.pokemonService.fetchPokemon();
  }

  onSubmit() {
    if (this.pokemonForm.invalid) return;

    const payload = this.pokemonForm.getRawValue();
    const currentEditId = this.editingId();

    if (currentEditId) {
      // UPDATE operation
      this.pokemonService.updatePokemon(currentEditId, payload).subscribe({
        next: () => {
          this.pokemonService.fetchPokemon();
          this.cancelEdit();
        },
        error: (err) => console.error('Update failed:', err)
      });
    } else {
      // CREATE operation
      this.pokemonService.savePokemon(payload).subscribe({
        next: () => {
          this.pokemonService.fetchPokemon();
          this.pokemonForm.reset({ level: 1 });
        },
        error: (err) => console.error('Save failed:', err)
      });
    }
  }

  onEdit(pokemon: PokemonEntry) {
    if (!pokemon._id) return;
    this.editingId.set(pokemon._id);
    this.pokemonForm.patchValue({
      name: pokemon.name,
      type: pokemon.type,
      level: pokemon.level,
      nature: pokemon.nature
    });
  }

  cancelEdit() {
    this.editingId.set(null);
    this.pokemonForm.reset({ level: 1 });
  }

  onDelete(id: string | undefined) {
    if (!id) return;
    if (confirm('Delete this Pokémon from Gary\'s winning team?')) {
      this.pokemonService.deletePokemon(id).subscribe({
        next: () => {
          if (this.editingId() === id) {
            this.cancelEdit();
          }
          this.pokemonService.fetchPokemon();
        },
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }
}