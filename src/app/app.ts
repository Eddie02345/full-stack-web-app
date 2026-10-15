import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokemonForm } from './pokemon-form/pokemon-form';

@Component({
  imports: [RouterOutlet, PokemonForm],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('full-stack-web-app');
}
