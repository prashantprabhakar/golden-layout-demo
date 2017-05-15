import {
  Component, ComponentFactoryResolver, HostListener, ComponentFactory, ComponentRef,ViewContainerRef,ReflectiveInjector,
  ElementRef, ViewChild
} from '@angular/core';
import {AppComponent} from './app.component';
import {App2Component} from './app2.component';
declare let GoldenLayout: any;

@Component({
  selector: 'golden-layout',
  template: `<div style="width:100%;height:500px;" id="layout" #layout>My First Angular 2 App</div>
  <br/><button (click)="sendEvent()">Send event through hub</button>`,
  entryComponents: [AppComponent, App2Component]
})
export class GLComponent {
  @ViewChild('layout') private layout: ElementRef;
  private config: any;
  private layout: ElementRef;
  
  constructor(private el: ElementRef, private viewContainer: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver){
    this.config = {
            content: [{
                type: 'row',
                content: [{
                    type: 'component',
                    componentName: 'test1',
                    componentState: {
                      message:"Top Left"
                    }
                }, { 
                        type: 'column',
                        content: [{
                            type: 'component',
                            componentName: 'test2',
                            componentState: {
                              message:"Top Right"
                            }
                        }, {
                                type: 'component',
                                componentName: 'test1',
                                componentState: {
                                  message:"Bottom Right"
                                }
                            }]
                    }]
            }]
        };
  }
  
  ngAfterViewInit(){
    this.layout = new GoldenLayout(this.config, this.layout.nativeElement);
    
    this.layout.registerComponent('test1', (container, componentState) => {
          let factory = this.componentFactoryResolver.resolveComponentFactory(AppComponent);
          
          let compRef = this.viewContainer.createComponent(factory);
          compRef.instance.setEventHub(this.layout.eventHub);
          compRef.instance.message = componentState.message;
          container.getElement().append(compRef.location.nativeElement); 

          container["compRef"] = compRef;
          
          compRef.changeDetectorRef.detectChanges();
    }); 
    
    this.layout.registerComponent('test2', (container, componentState) => {
          let factory = this.componentFactoryResolver.resolveComponentFactory(App2Component);
          
          let compRef = this.viewContainer.createComponent(factory);
          compRef.instance.setEventHub(this.layout.eventHub);
          compRef.instance.message = componentState.message;
          container.getElement().append(compRef.location.nativeElement); 
          
          container["compRef"] = compRef;
          
          compRef.changeDetectorRef.detectChanges();
    }); 
    
    this.layout.init();
    
		this.layout.on("itemDestroyed", item => {
			if (item.container != null) {
				let compRef = item.container["compRef"];
				if (compRef != null) {
					compRef.destroy();
				}
			}
		});
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
      if (this.layout)
        this.layout.updateSize();
  }
  
  sendEvent(){
    if (this.layout)
      this.layout.eventHub.emit("someEvent");
  }
}

