"use strict";(self.webpackChunkpaddle_scorer=self.webpackChunkpaddle_scorer||[]).push([[69],{1069:(G,m,a)=>{a.r(m),a.d(m,{HomePageModule:()=>T,routes:()=>f});var p=a(9808),y=a(5472),r=a(2382);const u=()=>{const s=Math.floor(206*Math.random()+50),e=Math.floor(206*Math.random()+50),o=Math.floor(206*Math.random()+50);return`#${s.toString(16).padStart(2,"0")}${e.toString(16).padStart(2,"0")}${o.toString(16).padStart(2,"0")}`};var t=a(1223);const h=["*"];let C=(()=>{class n{constructor(){}ngOnInit(){}}return n.\u0275fac=function(e){return new(e||n)},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-center-layout"]],ngContentSelectors:h,decls:1,vars:0,template:function(e,o){1&e&&(t.F$t(),t.Hsn(0))},styles:["[_nghost-%COMP%]{padding:32px;display:flex;flex-direction:column;justify-content:center;align-items:center}"],changeDetection:0}),n})();var g=a(4930),P=a(7579),M=a(4482),x=a(5403),v=a(8421),O=a(5032),N=a(1263),_=a(1424);let I=(()=>{class n{constructor(e){this.formArranyName=e,this._onDestroy=new P.x}ngOnInit(){if(!this.formGroupName)throw new Error("undefined @Input formGroupName");if(!this.formArranyName)throw new Error("undefined container formArranyName");if(this.formGroup=this.formArranyName.control.get(this.formGroupName),!this.formGroup)throw new Error(`undefined control ${this.formGroupName} of array ${this.formArranyName}`);this.formGroup.valueChanges.pipe(function b(n){return(0,M.e)((s,e)=>{(0,v.Xf)(n).subscribe((0,x.x)(e,()=>e.complete(),O.Z)),!e.closed&&s.subscribe(e)})}(this._onDestroy)).subscribe(()=>{this.formArranyName.control.updateValueAndValidity()})}writeValue(e){}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){}ngOnDestroy(){this._onDestroy.next(),this._onDestroy.complete()}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(r.CE,4))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-player-input"]],inputs:{formGroupName:"formGroupName"},features:[t._Bn([{provide:r.JU,useExisting:n,multi:!0}])],decls:3,vars:1,consts:[[3,"formGroup"],["formControlName","color"],["type","text","pInputText","","placeholder","Nombre","formControlName","name"]],template:function(e,o){1&e&&(t.TgZ(0,"form",0),t._UZ(1,"p-colorPicker",1)(2,"input",2),t.qZA()),2&e&&t.Q6J("formGroup",o.formGroup)},directives:[r._Y,r.JL,r.sg,N.zH,r.JJ,r.u,r.Fj,_.o],styles:["[_nghost-%COMP%]   form[_ngcontent-%COMP%]{display:flex;gap:8px;align-items:center}"],changeDetection:0}),n})();var A=a(7010);function B(n,s){if(1&n){const e=t.EpF();t.TgZ(0,"div",15),t._UZ(1,"app-player-input",16),t.TgZ(2,"p-button",17),t.NdJ("click",function(){const i=t.CHM(e).index,c=t.oxw();return c.players.controls.length>2&&c.removePlayerControl(i)}),t.qZA()()}if(2&n){const e=s.index,o=t.oxw();t.xp6(1),t.s9C("formGroupName",e),t.xp6(1),t.Q6J("disabled",o.players.controls.length<=2)}}let Z=(()=>{class n{constructor(e){this.fb=e,this.INIT_PLAYERS=4,this.buildForm()}ngOnInit(){this.loadFormValue()}get players(){return this.form.get("players")}addPlayerControl(){this.players.controls.push(this.fb.group({name:this.fb.control("",[r.kI.required]),color:this.fb.control(u(),[r.kI.required])})),this.players.updateValueAndValidity()}removePlayerControl(e){this.players.removeAt(e),this.players.updateValueAndValidity()}refreshColors(){var e;for(let o=0;o<this.players.controls.length;o++)null===(e=this.players.controls[o].get("color"))||void 0===e||e.setValue(u())}startGame(){this.saveFormValue()}loadFormValue(){var e;const o=null!==(e=+localStorage.getItem("playersLength"))&&void 0!==e?e:this.INIT_PLAYERS,l=localStorage.getItem("value");if(this.generateInitPlayers(o),l){const i=JSON.parse(l);this.form.setValue(i)}}saveFormValue(){localStorage.setItem("playersLength",JSON.stringify(this.players.length)),localStorage.setItem("value",JSON.stringify(this.form.getRawValue()))}buildForm(){this.form=this.fb.group({players:this.fb.array([]),score:this.fb.group({points:this.fb.control(6,[r.kI.min(1),r.kI.max(6)]),sets:this.fb.control(3,[r.kI.min(1),r.kI.max(3)])})})}generateInitPlayers(e){for(let o=0;o<e;o++)this.addPlayerControl()}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(r.qu))},n.\u0275cmp=t.Xpm({type:n,selectors:[["ng-component"]],decls:22,vars:9,consts:[[3,"formGroup"],["formArrayName","players",1,"players"],[1,"players-span"],[1,"players-div"],["icon","pi pi-user-plus","label","Agregar","iconPos","left",1,"players-button",3,"click"],["icon","pi pi-refresh","label","Colores","iconPos","left",1,"players-button",3,"click"],["class","player",4,"ngFor","ngForOf"],["formGroupName","score",1,"score"],[1,"score-points"],[1,"score-points-span"],["formControlName","points","mode","decimal","buttonLayout","vertical","spinnerMode","vertical","decrementButtonClass","p-button-secondary","incrementButtonClass","p-button-secondary","incrementButtonIcon","pi pi-plus","decrementButtonIcon","pi pi-minus",3,"showButtons","min","max"],[1,"score-sets"],[1,"score-sets-span"],["formControlName","sets","mode","decimal","buttonLayout","vertical","spinnerMode","vertical","decrementButtonClass","p-button-secondary","incrementButtonClass","p-button-secondary","incrementButtonIcon","pi pi-plus","decrementButtonIcon","pi pi-minus",3,"showButtons","min","max"],["pButton","","type","button",1,"p-button-raised","p-button-rounded","p-button-success","start-button",3,"disabled","click"],[1,"player"],[1,"player-input",3,"formGroupName"],["icon","pi pi-trash","styleClass","p-button-danger",1,"player-button",3,"disabled","click"]],template:function(e,o){1&e&&(t.TgZ(0,"app-center-layout")(1,"h1"),t._uU(2,"NUEVO JUEGO"),t.qZA(),t.TgZ(3,"form",0)(4,"div",1)(5,"span",2),t._uU(6,"Participantes"),t.qZA(),t.TgZ(7,"div",3)(8,"p-button",4),t.NdJ("click",function(){return o.addPlayerControl()}),t.qZA(),t.TgZ(9,"p-button",5),t.NdJ("click",function(){return o.refreshColors()}),t.qZA()(),t.YNc(10,B,3,2,"div",6),t.qZA(),t.TgZ(11,"div",7)(12,"div",8)(13,"span",9),t._uU(14,"Puntos"),t.qZA(),t._UZ(15,"p-inputNumber",10),t.qZA(),t.TgZ(16,"div",11)(17,"span",12),t._uU(18,"Sets"),t.qZA(),t._UZ(19,"p-inputNumber",13),t.qZA()()(),t.TgZ(20,"button",14),t.NdJ("click",function(){return o.startGame()}),t._uU(21," Comenzar "),t.qZA()()),2&e&&(t.xp6(3),t.Q6J("formGroup",o.form),t.xp6(7),t.Q6J("ngForOf",o.players.controls),t.xp6(5),t.Q6J("showButtons",!0)("min",1)("max",6),t.xp6(4),t.Q6J("showButtons",!0)("min",1)("max",3),t.xp6(1),t.Q6J("disabled",!o.form.valid))},directives:[C,r._Y,r.JL,r.sg,r.CE,g.zx,p.sg,I,r.x0,A.Rn,r.JJ,r.u,g.Hq],styles:["[_nghost-%COMP%]   form[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:32px}[_nghost-%COMP%]   form[_ngcontent-%COMP%]   .players[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:center;align-items:center;gap:8px}[_nghost-%COMP%]   form[_ngcontent-%COMP%]   .players[_ngcontent-%COMP%]   .players-div[_ngcontent-%COMP%]{display:flex;margin-bottom:8px;gap:8px}[_nghost-%COMP%]   form[_ngcontent-%COMP%]   .players[_ngcontent-%COMP%]   .player[_ngcontent-%COMP%]{display:flex;gap:16px}[_nghost-%COMP%]   form[_ngcontent-%COMP%]   .score[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-evenly;gap:8px}[_nghost-%COMP%]   form[_ngcontent-%COMP%]   .score[_ngcontent-%COMP%]   .score-points[_ngcontent-%COMP%], [_nghost-%COMP%]   form[_ngcontent-%COMP%]   .score[_ngcontent-%COMP%]   .score-sets[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:8px}[_nghost-%COMP%]   form[_ngcontent-%COMP%]   .score[_ngcontent-%COMP%]   .score-points[_ngcontent-%COMP%]     .p-inputnumber, [_nghost-%COMP%]   form[_ngcontent-%COMP%]   .score[_ngcontent-%COMP%]   .score-sets[_ngcontent-%COMP%]     .p-inputnumber{width:6rem}[_nghost-%COMP%]   .start-button[_ngcontent-%COMP%]{margin:32px 0}"]}),n})(),J=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[[p.ez]]}),n})();var d=a(7786);let S=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[[p.ez,d.m]]}),n})();const f=[{path:"",component:Z}];let T=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[[p.ez,y.Bz.forChild(f),d.m,J,S]]}),n})()}}]);