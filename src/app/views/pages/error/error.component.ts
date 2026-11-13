import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [RouterLink],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent implements OnInit {
  type: string | null = null;
  title: string = '';
  desc: string = '';

  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get('type');

    switch (this.type) {
      case '404':
        this.title = 'Página Não Encontrada';
        this.desc = 'Desculpe, não conseguimos encontrar a página que você está procurando.';
        break;
      case '500':
        this.title = 'Erro Interno do Servidor';
        this.desc = 'Ocorreu um erro inesperado ao processar sua solicitação.';
        break;
      default:
        this.type = 'Ooops..';
        this.title = 'Algo deu errado';
        this.desc = 'Parece que ocorreu um problema. Volte para a página inicial.';
    }
  }
}

