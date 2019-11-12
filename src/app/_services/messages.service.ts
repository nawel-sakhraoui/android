import { Injectable } from '@angular/core';
 import { Observable } from 'rxjs/Observable';
 //import * as io from 'socket.io-client';

import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';

import {ConfigService} from './api-config.service'; 

// import * as SocketIO from "nativescript-socket.io"; 

import { NgZone} from '@angular/core';
import { SocketIO } from "nativescript-socketio";  

@Injectable()
export class MessagesService {
        
    
    private socket :any ; 
    private host :string ; 
    
   
    constructor(private http: HttpClient, 
                private ngZone : NgZone, 
                private socketIO :SocketIO) { 
    
         this.host = ConfigService.storeServer; 
         //this.socket = SocketIO.connect(this.host) ; 
        
    }
   
    putOngoingMessage(commandid:string, message:string) {
         // console.log(message ) ; 
        return this.http.put(this.host+'/api/ongoing/'+commandid+'/message', {"text": message});

    }
    
    
   sendMessage(message, id ){ 
   
        this.socketIO.connect() ; 
         this.socketIO.emit('add-message', {"message":message, "id":id});
       this.socketIO.disconnect () ; 
       console.log (message) ; 
    
   } 
    
    getOngoingMessages(id) { 
        
        console.log(id) ; 
        let observable = new Observable(observer => { 
                this.socketIO.connect() ; 
                this.socketIO.on('ongoing'+id, (data) => {
                     this.ngZone.run(() => {
                               // Do stuff here
                             console.log(data ) ; 
                             observer.next(data);  
                          }); 
                       
                });
                return () => {
                     this.socketIO.disconnect(); 
                }; 
        }) 
        return observable;
    
    } 
    

      private messageSource = new BehaviorSubject({});
     currentMessageTo = this.messageSource.asObservable();

    upMessageTo(message: any) {
      //  console.log(article) ; 
      try {
         this.messageSource.next(message);
       }catch (error){
              this.messageSource.next({});
          }
     }
    
    //private messages 
    //create indexwith u1+u2 when u1 < u2 if exist 
    putPrivateMessage(froms, to, text ){
           return this.http.put(this.host+'/api/messages/private', {"text": text, "from": froms, 'to':to });

    }
    
    getPrivateMessages(froms,to, start, size){
           let id = "";
           if (froms.localeCompare(to)==1)
                id = to+froms  ; 
           else 
               id = froms+to ; 
          return this.http.get(this.host+'/api/messages/private/'+id+'/'+start+'/'+ size);

    }
    
    
   
    
      getCountPrivateMessages(froms,to){
           let id = "";
           if (froms.localeCompare(to)==1)
                id = to+froms  ; 
           else 
               id = froms+to ; 
          return this.http.get(this.host+'/api/messages/private/count/'+id);

    } 
    
    
    getPrivateMessage(froms, to ) {
        
           let id = "";
           if (froms.localeCompare(to)==1)
                id = to+froms  ; 
           else 
               id = froms+to ; 
        
         let observable = new Observable(observer => { 
                this.socketIO.connect() ; 
                this.socketIO.on(id, (data) => {
                     this.ngZone.run(() => {
                               // Do stuff here
                             console.log(data ) ; 
                             observer.next(data);  
                          });
                     
                });
                return () => {
                     this.socketIO.disconnect(); 
                }; 
        }) 
        return observable;
        
    }
    
    removePrivateMessage(){
        
    }
    

    getUserMessages (froms, size ) {
                                        
                  return this.http.get(this.host+'/api/messages/user/from/'+froms+"/size/"+size);

        
        }
    getCountUserMessages () {
        
                  return this.http.get(this.host+'/api/messages/user/count');
 
        }
    putRead(froms,to,  unread){
        
         let id = "";
      
           if (froms.localeCompare(to)==1)
                id = to+froms  ; 
           else 
               id = froms+to ; 
        
          
                       return this.http.put(this.host+'/api/messages/private/read/'+id,{"unread":  unread });

        }
    //get unread messages count 
    //get user private message 
     getUnreadMessages(froms,to) {
            
       let id = "";
      
           if (froms.localeCompare(to)==1)
                id = to+froms  ; 
           else 
               id = froms+to ; 
        
          
          let observable = new Observable(observer => { 
          
              this.socketIO.connect()
                this.socketIO.on('unread_messages'+id, (data) => {
                    console.log(data ) ; 
                     observer.next(data);   
                });
                return () => {
                    this.socketIO.disconnect(); 
                }; 
        }) 
        return observable;
    
    } 
    
}