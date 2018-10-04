/**
* Expression Calculator - Screen main
*
* @Ismael Pires
*/

import React, {Component} from 'react';
import {Alert, Platform, StyleSheet, TextInput, View, Text, TouchableWithoutFeedback} from 'react-native';
import Button from 'react-native-button';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			textValue:'',
			fontSize: 54,
			lastSize: 0
		}
	}
	
	_buttonPress = (value) => {
		this.setState({
			textValue: this.state.textValue + value
		});
	}
	
	_equalsPress = () => {
		
		var expression = this.state.textValue;
		var result = "";
		console.log(expression);
		
		try {
			{/* Verificando os operadores -raiz quadrada, -porcentagem */}		
			var square_root = expression.match(/([√])\d+/g);
			var value_percent = expression.match(/[\d[0-9]{0,2}\,?\d([%])\d+\,?\d+/g);
			var calc_percent = expression.match(/[\d\,?\d]+[-+*/]\d+\,?\d+[%]/g);
			var auto_mult = expression.match(/\d\(/g);
			
			console.log(square_root);
			console.log(value_percent);
			console.log(calc_percent);
			console.log(auto_mult);

			if (auto_mult !== null && auto_mult.length > 0){
				for (i=0; i<auto_mult.length; i++){
					separate = auto_mult[i].split('(');
					expression = expression.replace(auto_mult[i],separate[0]+'*(');
				}
			}
			
			if (square_root !== null && square_root.length > 0){
				for (i=0; i<square_root.length; i++){
					expression = expression.replace(square_root[i],'sqrt('+ square_root[i].substr(1) +')');
				}
			}
		
			console.log(expression);
			
			if (value_percent !== null && value_percent.length > 0){
				for (i=0; i<value_percent.length; i++){
					separate = value_percent[i].split('%');
					expression = expression.replace(value_percent[i],'(('+ separate[0] +'/100)*'+separate[1]+')');
				}
			}
			
			console.log(expression);
			
			if (calc_percent !== null && calc_percent.length > 0){
				for (i=0; i<calc_percent.length; i++){
					if (calc_percent[i].includes('*')){
						separate = calc_percent[i].split(['*']);
						expression = expression.replace(calc_percent[i],'(('+ separate[1].replace('%', '') +'/100)*'+separate[0]+')');
					}
					if (calc_percent[i].includes('/')){
						separate = calc_percent[i].split(['/']);
						expression = expression.replace(calc_percent[i],'(('+ separate[1].replace('%', '') +'/100)/'+separate[0]+')');
					}
					if (calc_percent[i].includes('+')){
						separate = calc_percent[i].split(['+']);
						expression = expression.replace(calc_percent[i],'(('+ separate[1].replace('%', '') +'/100)+'+separate[0]+')');
					}
					if (calc_percent[i].includes('-')){
						separate = calc_percent[i].split(['-']);
						expression = expression.replace(calc_percent[i],'(('+ separate[1].replace('%', '') +'/100)-'+separate[0]+')');
					}
				}
			}
			
			console.log(expression);
	
			var Parser = require('expr-eval').Parser;
			result = Parser.evaluate(expression).toFixed(2)
			console.log(result); 

			this.setState({
				textValue: result.replace('.00','')
			});


		} catch(err){
			this._showAlert();
			console.log(err);
		}
	}

	_delPress = () =>{
		this.setState({
			textValue: this.state.textValue.slice(0, -1)
		});
	}

	_delLongPress = () =>{
		this.setState({
			textValue: ''
		});
	}

	_showAlert = () => {
		this.setState({
		  showAlert: true
		});
	  };
	
	_hideAlert = () => {
		this.setState({
		  showAlert: false
		});
	  };

	updateSize = (width, height) => {
		console.log('Largura:', width)
		console.log('Altura:', height)
		console.log('Size:', this.state.textValue.length)
		console.log('lastSize:', this.state.lastSize)

	    if ((this.state.lastSize != this.state.textValue.length) && ((this.state.lastSize != this.state.textValue.length-1) || this.state.lastSize == 0)){
			if (this.state.textValue.length == 0){
				this.setState({fontSize:54})
			}
			if (width >=300 && width <500){
				console.log('Resultado:', ((width/this.state.textValue.length)+(width*0.05)))
				this.setState({fontSize: ((width/this.state.textValue.length)+(width*0.05))});
			} else if (width >=500){
				console.log('Resultado:', ((width/this.state.textValue.length)-(width*0.05)))
				this.setState({fontSize: ((width/this.state.textValue.length)-(width*0.05))});
			}
			this.state.lastSize = this.state.textValue.length
		}
	}

render() {
	const {showAlert} = this.state;

	return (
		<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
		{/* Navigator */}
		<View style={styles.column_one}>
		<TextInput
			style={{
				flex : 1, height: 100, textAlign: 'right', fontSize: this.state.fontSize, fontWeight: 'bold', backgroundColor: '#FFFFFF',
				paddingRight: 20, color: '#4F4F4F'
			}}
			placeholder= '0'
			editable= {false}
			multiline = {true}
			numberOfLines = {4}
			maxLength = {50}
			value={this.state.textValue}
			onChangeText={(value) => this.setState({textValue: value})}
			onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.width, e.nativeEvent.contentSize.height)}
		/>
		</View>
		{/* Calculator Container*/}
		<View style={styles.column_two}>
		{/* Container 1 */}
		<View style={{flex: 70, backgroundColor: '#36648B'}}>	
		{/* First Line */}
		<View style={styles.line }>
		<View style={styles.view}>							
		<Button style={{paddingTop: 15, fontSize: 38, color: '#FFFFFF'}} 
		onPress={() => this._buttonPress('^')}>
		ˆ
		</Button>
		</View>
		<View style={styles.view}>
		<Button style={styles.button} 
		onPress={() => this._buttonPress('√')}>
		√
		</Button>
		</View>
		<View style={styles.view}>
		<Button style={styles.button} 
		onPress={() => this._buttonPress('%')}>
		%
		</Button>
		</View>
		</View>	
		
		{/* Second line */}
		<View style={styles.line}>
		<View style={styles.view}>
		<Button style={styles.button}
		onPress={() => this._buttonPress('7')}>
		7
		</Button>
		</View>
		<View style={styles.view}>
		<Button style={styles.button}
		onPress={() => this._buttonPress('8')}>
		8
		</Button>
		</View>
		<View style={styles.view}>
		<Button style={styles.button}
		onPress={() => this._buttonPress('9')}>
		9
		</Button>
		</View>
		</View>
		
		{/* Three line */}
		<View style={styles.line}>
		<View style={styles.view}>
		<Button style={styles.button}
		onPress={() => this._buttonPress('4')}>
		4
		</Button>
		</View>
		<View style={styles.view}>
		<Button style={styles.button}
		onPress={() => this._buttonPress('5')}>
		5
		</Button>
		</View>
		<View style={styles.view}>
		<Button style={styles.button}
		onPress={() => this._buttonPress('6')}>
		6
		</Button>
		</View>
		</View>
		
		{/* Four line numbers */}	
		<View style={styles.line}>
		<View style={styles.view}>
		<Button style={styles.button}
		onPress={() => this._buttonPress('1')}>
		1
		</Button>
		</View>
		<View style={styles.view}>
		<Button style={styles.button}
		onPress={() => this._buttonPress('2')}>
		2
		</Button>
		</View>
		<View style={styles.view}>
		<Button style={styles.button}
		onPress={() => this._buttonPress('3')}>
		3
		</Button>
		</View>
		</View>	
		
		{/* First line numbers */}	
		<View style={styles.line}>
		<View style={styles.view}>
		<Button style={styles.button}
		onPress={() => this._buttonPress('.')}>
		.
		</Button>
		</View>
		<View style={styles.view}>
		<Button style={styles.button}
		onPress={() => this._buttonPress('0')}>
		0
		</Button>
		</View>
		<View style={styles.view}>
		<Button style={styles.button}
		onPress={() => this._buttonPress('00')}>
		00
		</Button>
		</View>
		</View>	
		</View>
		
		{/* Container 2 */}
		<View style={{flex: 30, backgroundColor: '#009ACD'}}>
		{/* First line operators */}	
		<View style={styles.line_operator}>
		<View style={styles.view_operator}>
		<TouchableWithoutFeedback onPress={() => this._delPress()}
		onLongPress={() => this._delLongPress()}>
		<View style={{padding: 25}}>
		<Text style={styles.del}>DEL</Text>
		</View>
		</TouchableWithoutFeedback>
		</View>
		</View>
		<View style={styles.line_operator}>
		<View style={styles.view_operator}>
		<Button style={styles.button_operator}
		onPress={() => this._buttonPress('+')}>
		+
		</Button>
		</View>
		<View style={styles.view_operator}>
		<Button style={styles.button_operator}
		onPress={() => this._buttonPress('-')}>
		-
		</Button>
		</View>
		</View>
		{/* First line operators */}	
		<View style={styles.line_operator}>
		<View style={styles.view_operator}>
		<Button style={styles.button_operator}
		onPress={() => this._buttonPress('*')}>
		*
		</Button>
		</View>
		<View style={styles.view_operator}>
		<Button style={styles.button_operator}
		onPress={() => this._buttonPress('/')}>
		/
		</Button>
		</View>
		</View>
		<View style={styles.line_operator}>
		<View style={styles.view_operator}>
		<Button style={styles.button_operator}
		onPress={() => this._buttonPress('(')}>
		(
			</Button>
			</View>
			<View style={styles.view_operator}>
			<Button style={styles.button_operator}
			onPress={() => this._buttonPress(')')}>
		)
		</Button>
		</View>
		</View>
		<View style={styles.line_operator}>
		<View style={styles.view_operator}>
		<Button style={styles.equals}
		onPress={() => this._equalsPress()}>
		=
		</Button>
		</View>
		</View>
		</View>
		</View>
		<AwesomeAlert
			show={showAlert}
			showProgress={false}
			title="Ops! Ocorreu um erro"
			message="Favor revise sua expressão!"
			closeOnTouchOutside={true}
			closeOnHardwareBackPress={false}
			showConfirmButton={true}
			confirmText="Entendi"
			confirmButtonColor="#36648B"
			onConfirmPressed={() => {
			this._hideAlert();
		}}
		/>
		</View>
	);
}
}

const styles = StyleSheet.create({
	line: {
		flex: 15, 
		flexDirection: 'row'
	},
	line_operator:{
		flex: 1, 
		flexDirection: 'row'
	},
	column_one:{
		flex: 25
	},
	column_two:{
		flex: 75, 
		flexDirection: 'row' 	
	},
	view: {
		flex: 30, 
		justifyContent: 'center', 
		alignItems: 'stretch', 
		color: '#FFFFFF',
		backgroundColor: '#36648B'
	},
	view_operator:{
		flex: 50,
		justifyContent: 'center', 
		alignItems: 'stretch', 
		color: '#FFFFFF',
		backgroundColor: '#009ACD',
		borderWidth: 0.2,
		borderColor: '#36648B'
	},
	button: {
		color: '#FFFFFF', 
		fontSize: 28,
		padding: 25
	},
	button_operator: {
		color: '#FFFFFF', 
		fontSize: 28,
		paddingTop: 25,
		paddingBottom: 25
	},
	del:{
		fontSize: 26,
		fontWeight: 'bold',
		color: '#FFFFFF',
		textAlign: 'center'
	},
	equals:{
		fontSize: 58,
		color: '#FFFFFF',
		padding: 25
	}
});



