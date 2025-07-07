import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-chat-bot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-chat-bot.component.html',
  styleUrl: './ai-chat-bot.component.css'
})
export class AiChatBotComponent implements OnInit {

  logined:boolean =false ;

  constructor(private _DataService:DataService){}
  ngOnInit(): void {
    this._DataService.isLogined.subscribe(x =>{
      this.logined =  x ;
    })
  }

}
