var app = (function(){ 
	app.matrixs = (function(){
		app.matrixs.matrix = (function(elementId, matrixName, rows, cols, readonly){

			// Базовые свойства для матрицы
			function matrix(elementId, matrixName, readonly)  {
				this.element = document.getElementById(elementId);
				this.name    = matrixName;
				this.countCol  = 0;
				this.countRow  = 0;
				this.transposed = false;
				this.readonly = readonly;
			};

			// Методы строки матрицы
			matrix.prototype.row = {
	
				create : function() {
					var row = document.createElement('div');
			    	row.className = "row";

			    	return row;
				}

			};

			// Методы столбца матрицы
			matrix.prototype.cell = {

				create : function(placeholder) {
					var cell = document.createElement('input');
			    	cell.className = "cell";
			    	cell.placeholder = placeholder;

			    	this.addEvents(cell);

			    	return cell;
			    },

			    addEvents : function(cell) {
			    	cell.onkeydown= function(event) {
			    		 var charCode = event.charCode || event.keyCode;

			    		// Если нажата кнопка цифры
				    	if ((charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105)) {
				    		// Если в поле ничего не введено или введен знак -
				    		if((cell.value == "" || cell.value == "-")){
				    			// то можем ввести любое число
				    			return true;
				    		}
				    		// Если в поле уже что-то введено
				    		else {
				    			// Если введеное число 1 или -1, а новая цифра = 0, то ввод возможен
				    			if ((cell.value == 1 || cell.value == -1) && charCode == 48 || charCode == 96) {
				    				return true;
				    			}
				    			// Иначе ввод невозможен, число не может быть > 10
				    			else {
				    				return false;
				    			}
				    			
				   	 		}
				    	}
				   	 	
				   	 	// Если нажата любая другая клавиша
				    	else {
				    		// Оставляем функциональность клавиш backspace и tab, и знака минуса
				    		if (charCode == 8 || charCode == 9 || charCode == 173 || charCode == 109) {
				    			return true;
				    		}
				    		// Предотвращаем ввод
				    		else {
				    			return false;
				    		}	
				    	}

			    	}

					cell.onfocus = function() {
						replaceСolor(1);
					}

					cell.onblur = function() {
						replaceСolor(0);
					}
				}
			};

			// Метод для транспонирования матрицы
			matrix.prototype.matrixTransposed = function () {
				var matrixRows = this.element.getElementsByTagName("div"),
					matrixRowsLength = matrixRows.length,
					newMatrixRows = [];

				// Создаем новую матрицу
				for (var i = 0; i < this.countCol; i++) {
					newMatrixRows[i] = [];

					for (var j = 0; j < this.countRow; j++) {
						newMatrixRows[i][j] = matrixRows[j].getElementsByTagName("input")[i]; 
					}
				}

				// Удаляем модель-матрицы из DOM	
				while(matrixRows.length > 0) {
					this.element.removeChild(matrixRows[0]);
					matrixRows = this.element.getElementsByTagName("div");
				}

				// N X K = K X N
				var countColMatrix = this.countCol;
				this.countCol = this.countRow;
				this.countRow = countColMatrix;

				// Создаем новую модель-матрицы в DOM
				for (var i = 0; i < this.countRow ; i++) {;
					var newRow = this.row.create();
					for (var j = 0; j < this.countCol; j++) {
						newMatrixRows[i][j].placeholder = this.name + (i+1) + "," + (j+1);
						newRow.appendChild(newMatrixRows[i][j]);
					}
					this.element.appendChild(newRow);
				}

				// Меняем состояние матрицы
				if (this.transposed) {
					this.transposed = false;
				}
				else {
					this.transposed = true;
				}
			};

			// Метод для добавления новой строки в матрицу
			matrix.prototype.addRow = function () {
				var row = this.row.create(),
					readonly = false;

			    this.countRow += 1;

			    for (i=0; i<this.countCol; i++) {
			    	var placeholder = "" + this.name + this.countRow + "," + (i+1),
			    		cell = this.cell.create(placeholder);
			    		
			    	// Если матрица является результирующей, то ячейки находятся в режиме readonly
		    		if(this.readonly) {
		    			cell.setAttribute("readonly", "readonly");
		    		}

			    	row.appendChild(cell);
			    }

			    this.element.appendChild(row);
			};

			// Метод для добавления нового столбца в матрицу
			matrix.prototype.addCol = function() {
				this.countCol += 1;

				rows = this.element.getElementsByTagName('div');
			 
				for (var i = 0; i<rows.length; i++) {
					var placeholder = "" + this.name + (i+1) + "." + this.countCol,
			    		cell = this.cell.create(placeholder);

			    	// Если матрица является результирующей, то ячейки находятся в режиме readonly
		    		if(this.readonly) {
		    			cell.setAttribute("readonly", "readonly");
		    		}

					rows[i].appendChild(cell);
				}
			};

			// Метод для удаления строки из матрицы
			matrix.prototype.removeRow = function() {
				// Получаем список всех строк матрицы
				rows = this.element.getElementsByTagName('div');
				// Удаляем n-ю строку n-мерной матрицы
				this.element.removeChild(rows[rows.length-1]);
				// Уменьшаем количество строк в матрице
				this.countRow -= 1;
			};

			// Метод для удаления столбца из матрицы
			matrix.prototype.removeCol = function() {
				// Получаем список всех строк матрицы
				rows = this.element.getElementsByTagName('div');
				// Удаляем k-ый столбец из N x K матрицы
				for (var i = 0; i<rows.length; i++) {
					cells = rows[i].getElementsByTagName('input');
					rows[i].removeChild(cells[cells.length-1]);
				}

				// Уменьшаем количество столбцов в матрице N x K -> N x K-1
				this.countCol -= 1;
			};

			// Метод для очистки матрицы
			matrix.prototype.clearMatrix = function() {
				var cells = this.element.getElementsByTagName('input');

					for (i = 0; i < cells.length; i++) {
						cells[i].value = "";
					}
			};

			// Метод для проверки - матрица пустая
			matrix.prototype.checkEmpty = function() {
				var cells = this.element.getElementsByTagName('input');
				var flag = true;
				for (i = 0; i < cells.length; i++) {
					if (cells[i].value === "") {
						flag = false;
					}
				}
				return flag;
			}

			// Метод для создания двумерно массива из заполненого DOM-элемента
			matrix.prototype.inDigital = function() {
				var newArr = [];

				for (var i = 0; i < this.countRow; i++) {
					newArr[i] = [];
					newRow = this.element.getElementsByTagName("div")[i];
					for (var j = 0; j < this.countCol; j++) {
						newArr[i][j] = newRow.getElementsByTagName("input")[j].value;
					}
				}

				return newArr;
			};

			// Метод для перемножения матриц
			matrix.prototype.multiply = function(matrixA, matrixB) {
				var A = matrixA.inDigital(),
					B = matrixB.inDigital(),
					R = [], sum;

				for (var i=0; i < matrixA.countRow; i++) {
					R[i] = [];

					for(var j=0; j<matrixB.countCol; j++) {

						sum = 0;	
						for (var k = 0; k < matrixB.countRow; k++) {
							sum = sum + (A[i][k]*B[k][j]);
						}
						R[i][j] = sum;
					}
				}

				this.innerResult(R);
			};

			// Метод для заполнения матрицы результатами вычислений
			matrix.prototype.innerResult = function(matrix) {
				var matrixRows = this.element.getElementsByTagName("div");

				for(var i = 0; i < this.countRow; i++) {
					var matrixCells = matrixRows[i].getElementsByTagName("input");
					for(var j = 0; j < this.countCol; j++) {
						matrixCells[j].value = matrix[i][j];
					}
				}
			}

			// Конструктор матрицы
			initMatrix = function(elementId, matrixName, rows, cols, readonly) {
				var newMatrix = new matrix(elementId, matrixName, readonly);

				var i;
				for (i = 0; i < cols; i++) {
					newMatrix.addCol();
				}
				for (i = 0; i < rows; i++) {
					newMatrix.addRow();
				}

				return newMatrix;
			};

			// Инициализация матрицы
			return initMatrix(elementId, matrixName, rows, cols, readonly);
		});

		var rows = cols = 2,
			matrixR = app.matrixs.matrix("js-matrix-result", "c", rows, cols, true),
			matrixA = app.matrixs.matrix("js-matrix-a", "a", rows, cols, false),
			matrixB = app.matrixs.matrix("js-matrix-b", "b", rows, cols, false),
			mas = [matrixA, matrixB, matrixR];

		return mas;
	});

	app.manupulate = (function(mas){

		var matrixA = mas[0], matrixB = mas[1], matrixR = mas[2],

			// Состояния приложения 
			flagError = false,  // Матрицы нельзя умножать 
			transposed = false; // Матрицы не находятся в транспонированном состоянии

		// Функция, для получения матрицы, которая будет изменяться
		function getChangeMatrix() {
			var matrixLabels = document.getElementsByName('matrix_check');
			
			if (matrixLabels[0].checked) {
				return matrixA;
			}
			else {
				return matrixB;
			}
		};

			// Добавление новой строки
		document.getElementById("js-addRow").onclick = function() {
			var matrix = getChangeMatrix();

			if(matrix.countRow < 10) {
				if (matrix == matrixA && !matrixA.transposed) {
					matrixR.addRow();
				}

				if (matrix == matrixB && matrixB.transposed) {
					matrixR.addRow();
				}
				matrix.addRow();
			}
		};

		// Удаление строки из матрицы
		document.getElementById("js-removeRow").onclick = function() {
			var matrix = getChangeMatrix();

			if(matrix.countRow > 2) {
				if (matrix == matrixA && !matrixA.transposed) {
					matrixR.removeRow();
				}
				if (matrix == matrixB && matrixB.transposed) {
					matrixR.removeRow();
				}
				matrix.removeRow();
			}
		};

		// Добавление нового столбца
		document.getElementById("js-addCol").onclick = function() {
			var matrix = getChangeMatrix();

			if(matrix.countCol < 10) {
				if (matrix == matrixB  && !matrixB.transposed) {
					matrixR.addCol();
				}
				if (matrix == matrixA && matrixA.transposed) {
					matrixR.addCol();
				}
				matrix.addCol();
			}
		};

		// Удаление столбца из матрицы
		document.getElementById("js-removeCol").onclick = function() {
			var matrix = getChangeMatrix();

			if(matrix.countCol > 2) {
				if (matrix == matrixB & !matrixB.transposed) {
					matrixR.removeCol();
				}
				if (matrix == matrixA && matrixA.transposed) {
					matrixR.removeCol();
				}
				matrix.removeCol();
			}
		};

		// Очистка матриц
		document.getElementById("js-clearMatrixs").onclick = function() {
			var msg = "Матрицы успешно очищены";

			matrixA.clearMatrix();
			matrixB.clearMatrix();
			matrixR.clearMatrix();

			// Вывод оповещения
			replaceСolor(3, msg);
		};

		// Меняем матрицы местами
		document.getElementById("js-swapMatrixs").onclick = function() {
			
				// Меняем местами
				if(transposed) {
					document.getElementById("js-app-row-first").replaceChild(matrixA.element, matrixB.element);
					document.getElementById("js-app-row-second").appendChild(matrixB.element);
					transposed = false;
				}
				else {
					document.getElementById("js-app-row-first").replaceChild(matrixB.element, matrixA.element);
					document.getElementById("js-app-row-second").appendChild(matrixA.element);
					transposed= true;
				}

				// Транспонируем матрицы
				matrixR.matrixTransposed();
				matrixA.matrixTransposed();
				matrixB.matrixTransposed();

				replaceСolor(3, "Матрицы поменялись местами");
		}
		
		// Умножение матриц
		document.getElementById("js-getResult").onclick = function() {
			var errorCol = "Такие матрицы нельзя перемножить, так как количество столбцов матрицы А не равно количеству строк матрицы B.",
				errorColTransosed = "Такие матрицы нельзя перемножить, так как количество столбцов матрицы B не равно количеству строк матрицы A.",
				errorEmpty = "Нельзя перемножить матрицы, которые имеют пустые ячейки",
				successOperation = "Матрицы успешно умножены";
			
			// Для умножения двух матриц, количество столбцов матрицы А должно быть равно количеству строк матрицы B
			if((matrixA.countCol === matrixB.countRow) || (matrixR.transposed && matrixB.countCol === matrixA.countRow)) {
				// Проверка на пустые ячейки
				if(matrixA.checkEmpty() && matrixB.checkEmpty()) {
					if (flagError) {
						replaceСolor(0);
						flagError = false;
					}

					// Матрицы можно умножать
					if(!matrixR.transposed) {
						matrixR.multiply(matrixA, matrixB);
					}
					else {
						matrixR.multiply(matrixB,matrixA);
					}

					replaceСolor(3, successOperation);
				}
				else {
					// Меняем цвет колонки и выводим сообщение о ошибкк
					flagError = true;
					replaceСolor(2, errorEmpty);
				}
			}
			else {
				// Меняем цвет колонки и выводим сообщение
				if((matrixR.transposed && matrixB.countCol === matrixA.countRow)) {
					replaceСolor(2, errorCol);
				}
				else {
					replaceСolor(2, errorColTransosed);
				}

				flagError = true;
			
			}
		}

		// Функция для смены цвета панели-управления 
		/* { status | 0 <= status <= 3;
			 status = 0 -> Нормальное состояние панели управления, 
			 status = 1 -> Предупреждение, невозможность выполнить действие ,
			 status = 2 -> Фокус элемента, 
			 status = 3 -> Операция успешно выполнена
		   } 
		*/

		replaceСolor = function(status, msg) {
			var	aside = document.getElementById("js-appPanel"),
				colorPanel, colorFont = "#000";

				switch (status) {
				    case 0:
				        colorPanel = "#bcbcbc" // Серый цвет 
					    break
				 	case 1:
				 		colorPanel = "#5199db" // Синий цвет
				 		break
				 	case 2:
				 		colorPanel = "#f6c1c0" // Розовый цвет
				 		colorFont  = "#da0902"
				 		break
				 	case 3:
				 		colorPanel = "#bad7b0" // Зеленый цвет
						colorFont  = "#265715"
						break
				}

				
				aside.style.background = colorPanel;
				addMsg(msg, colorPanel, colorFont); // добавляем оповещение
	
				// Функция для добавления оповещения
				function addMsg(msg, colorPanel, colorFont) {
					var messagePanel = document.getElementById("js-panel-warning");
					if (msg !== undefined) {
						messagePanel.style.color = colorFont; 
						messagePanel.innerHTML = msg;
					}
					else {
						messagePanel.innerHTML = "";
					}
				}
		};
	});

	// Инициализация приложения
	app.init = function() {
		objMatrix = app.matrixs();
		app.manupulate(objMatrix);
	};

	return app.init();
});

// Инициализация глобального модуля
app();