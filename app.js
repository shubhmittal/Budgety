//starting the project
//module that handles budget data===budget controller, module are created using module pattern
var budgetController=(function(){
/*   var x=23;
    var add=function(a){
        return(a+x);
    }
    
    // returning object
    return {
        //publicTest is public method because it is returned
        publicTest:function(b){
           // console.log(add(b));
            return add(b);           
    }}
*/
    //function constructor
    var Expense= function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    }
    
    Expense.prototype.calcPercentage=function(totalIncome){
        if(totalIncome>0){
            this.percentage=Math.round((this.value/totalIncome)*100);
        }else{
            this.percentage=-1;
        }
    }
    Expense.prototype.getPercentage=function(){
        return this.percentage;
    }
    
    var Income= function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    }
    var calculateTotal=function(type){
        var sum=0;
        data.allItems[type].forEach(function(curr){
            sum+=curr.value;
        });
        data.totals[type]=sum;
    }
    var data={
        allItems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage: -1
    };
     return{
        addItem:function(type,des,value){
            var newItem,ID;
            //Create new ID
            if(data.allItems[type].length>0){
                ID=data.allItems[type][data.allItems[type].length-1].id+1;
            }else{
                ID=0;
            }
            
            //Create new item
            if(type==='exp'){
                 newItem=new Expense(ID,des,value);
            }else if(type==='inc'){
                newItem=new Income(ID,des,value);
            }
            //Push it into our dataStructure
            data.allItems[type].push(newItem);
            //Rreturn new element
            return newItem;
        },
        deleteItem:function(type,id){
            var index,ids;
            //id=3
            //data.allItems[type][id]; this one is wrong because it use indexes not id
            ids=data.allItems[type].map(function(current){
               // map returns brand new array i.e ids
                return current.id;
            });
            //ids have all the id
            
            index=ids.indexOf(id);
            if(index!==-1){
                //splice delete the element
                data.allItems[type].splice(index,1);
                //index----from where we want to delete
                //1--------how many elements we want to delete
            }
            
            
        },
         calculateBudgte:function(){
             //calculate total income and expenses
             calculateTotal('exp');
             calculateTotal('inc');
             
             //calculate the budget income-expense
             data.budget=data.totals.inc-data.totals.exp;
             
             //calculate the percentage of income that we have spent
             if(data.totals.inc>0){
                 data.percentage=Math.round((data.totals.exp/data.totals.inc)*100); 
             }  else{
                 data.percentage=-1;
             }
         },
         
         
         //calculate expense percentages for each of the expense
         calculatePercentages:function(){
             data.allItems.exp.forEach(function(cur){
                 cur.calcPercentage(data.totals.inc);
             });
         },
         
         getPercentages:function(){
            var allPerc=data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            }) ;
             return allPerc;// allPerc is an array
         },
         getBudget: function(){
             return{
                 budget:data.budget,
                 totalInc:data.totals.inc,
                 totalExp:data.totals.exp,
                 percentage:data.percentage
             };
         },
        testing: function(){
            console.log(data);
        }
    };
})();


//console.log(budgetController.x);
//undefined because cant access private x;

//var p=budgetController.add(5);
//undefined because cant access private

//budgetController.publicTest(5);// publicTest is public method

  

//module for UI ===UIController
var UIController=(function(){
    
    var DOMstrings={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBTn:'.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercLabel:'.item__percentage',
        dateLabel:'.budget__title--month'
    };
    var formatNumber=function(num,type){
            //+ or -
            //exactly 2 decimal places
            //comma separating thousands
            num=Math.abs(num);
            num=num.toFixed(2);
            var numSplit=num.split('.');
            var int=numSplit[0];
            if(int.length>3){
                int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);// input 2506525  output-->2506,525
            }
            
            var dec=numSplit[1];
            
            return (type==='exp'?'-':'+')+' '+int+'.'+dec;
        }
    return{
        getInput :function(){
            /*
            var type=document.querySelector('.add__type').value;// select inc or exp
            var description=document.querySelector('.add__description').value;
            var value=document.querySelector('.add__value').value;
            // to return all these best thing is to return the object containing all 3 properties
            */
            return{
                /*
                type:document.querySelector('.add__type').value,// select inc or exp
                description:document.querySelector('.add__description').value,
                value:document.querySelector('.add__value').value
                */
                type:document.querySelector(DOMstrings.inputType).value,
                description:document.querySelector(DOMstrings.inputDescription).value,
                //value:document.querySelector(DOMstrings.inputValue).value// this gives output as string
                value:parseFloat(document.querySelector(DOMstrings.inputValue).value)// now we have float value
            };
        },
        
        // here we have passed object(function constructor) that is created recently
        addListItem:function(obj,type){
            var html,newHtml,element;
            // create an html strin with placeholder tag
            if(type==='inc'){
                element=DOMstrings.incomeContainer;
                html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type==='exp'){
                element=DOMstrings.expensesContainer;
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace the placecholder tag with actual data
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
            
            //insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml); 
        },
        deleteListItem:function(selectorID){
            var el=document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearFields:function(){
            var fields,fieldsArr;
            fields=document.querySelectorAll(DOMstrings.inputDescription+', '+DOMstrings.inputValue);//it will return a list 
            //we have to convert fields into array
            //fieldsArr is array of list
            fieldsArr=Array.prototype.slice.call(fields);
            
            //we have used for each loop for description and value
            fieldsArr.forEach(function(current,index,array){
                //current value being processed
                //index of the vale
                //entire array
                current.value="";
            });
            fieldsArr[0].focus();
        },
        displayBudget:function(obj){
            var type;
            obj.budget>0?type='inc':type='exp';
            document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(obj.budget,type);
             document.querySelector(DOMstrings.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
             document.querySelector(DOMstrings.expensesLabel).textContent=formatNumber(obj.totalExp,'exp');
             
            if(obj.percentage>0){
                document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage+'%';
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent='--';
            }
            
        },
        displayPercentages:function(percentages){
            var fields=document.querySelectorAll(DOMstrings.expensesPercLabel);
            var nodeListForEach=function(list,callback){
                for(var i=0;i<list.length; i++){
                    callback(list[i],i);
                }
            };
            nodeListForEach(fields,function(current,index){
                if(percentages[index]>0){
                    current.textContent=percentages[index]+'%';
                }else{
                    current.textContent='---';
                }
                
            });
        },
        
        displayMonth:function(){
            var now,year,month,months;
            now=new Date();
            year=now.getFullYear();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month=now.getMonth();
            document.querySelector(DOMstrings.dateLabel).textContent=months[month-1]+' '+year;
        },
        getDOMStrings:function(){
            return DOMstrings;
        }
        
    };
})();


    
//Till now both budgetController and UIController are independent but to make them dependent we have used controller
// this controller can use the code of other 2(uicontroller and budgetcontroller)
//GLOBAL APP CONTROLER
var controller=(function(budgetCtrl,UICtrl){
    
    var setupEventListeners=function(){
        var DOM=UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBTn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress',function(event){
            if(event.keyCode===13 || event.which===13){
                ctrlAddItem();
            }
        });
        
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        
    }
    
   // var DOM=UICtrl.getDOMStrings();
        
/*    // budgetCtrl.publicTest(5);
    var z=budgetCtrl.publicTest(5);
    //console.log(z);
    return {
        anotherPublic:function(){
            console.log(z);
        }
    }
*/
    
    
    var updateBudget=function(){
        //1.Calculate the budget
        budgetCtrl.calculateBudgte();
        
        //2.return the budget
        var budget=budgetCtrl.getBudget();
        
        //3.Display the budget on the UI
        //console.log(budget);
        UICtrl.displayBudget(budget);
        
    }
    
    var updatePercentages=function(){
        
        //1. calculate percentage
        budgetCtrl.calculatePercentages();
        
        //2.read percentages from budget controller
        var percentages=budgetCtrl.getPercentages();
        
        //3. update the ui
        //console.log(percentages);
        UICtrl.displayPercentages(percentages);
    }
    
    
    var ctrlAddItem=function(){
        var input,newItem;
        //1.Get the input data
        input=UICtrl.getInput();
       // console.log(input);
        
        if(input.description!=="" && !isNaN(input.value) && input.value>0){
            //2.Add the item to the budget controller
            newItem=budgetCtrl.addItem(input.type,input.description, input.value);
            //budgetCtrl.testing();
    
            //3.Add the item to the UI
            UICtrl.addListItem(newItem,input.type);
        
            //Clearing the fields i.e placeholder when clicked or press entered
            UICtrl.clearFields();
        
        
            //calling the budget function
            updateBudget();
            
            //calculate and update percentage
            updatePercentages();
        }
        
        //console.log('..........');
    }
    
    var ctrlDeleteItem=function(event){
        var itemID,splitID,type,ID;
        //console.log(event.target);//this gives us the information of target where we have clicked
        //console.log(event.target.parentNode);//this will give parent node of target
       // console.log(event.target.parentNode.parentNode.parentNode.parentNode);//upto main parent node
       itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;//this will give unique id
        if(itemID){
            
            //inc-1
            splitID=itemID.split('-');//split itemID by - and stored it into array
            type=splitID[0];
            ID=parseInt(splitID[1]);
            
            //delete the item from datastructure
            budgetCtrl.deleteItem(type,ID);
            
            
            //delete the item from UI
            UICtrl.deleteListItem(itemID);
            
            
            //update and show the new budget
            updateBudget();
            
            //calculate and update percentage
            updatePercentages();
        }   
    }
/*
    document.querySelector('.add__btn').addEventListener('click',function(){
        // console.log('button is clicked');
    
    
        //1.Get the input data
    
        //2.Add the item to the budget controller
    
        //3.Add the item to the UI
    
        //4.Calculate the budget
    
        //5.Display the budget on the UI
    
    
});
*/
    
    /*
    document.querySelector(DOM.inputBTn).addEventListener('click',ctrlAddItem);
    
    document.addEventListener('keypress',function(event){
       // console.log('key is pressed');
        if(event.keyCode===13 || event.which===13){
           // console.log('enter key is pressed');
            ctrlAddItem();
        }
    });
    */
    
    return {
      init:function(){
          UICtrl.displayMonth();
          UICtrl.displayBudget({
                 budget:0,
                 totalInc:0,
                 totalExp:0,
                 percentage:0
             });
          setupEventListeners();
      }  
    };
      
})(budgetController,UIController);
//console.log(controller.z);   error accessing private part
//controller.anotherPublic();  this will gives an output
controller.init();





    