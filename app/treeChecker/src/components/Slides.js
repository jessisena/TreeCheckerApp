import React, { Component } from 'react';
import { ViewPagerAndroid, View, Text, Image } from 'react-native';
import { Button } from 'react-native-elements';

class Slides extends Component {

	state = { currentSlide: 0, textButton: 'Skip', buttonColor: '#388E3C' };

	onButtonPress() {
		this.props.navigation.navigate('gzflow');
  }

	updatePagination(e) {
		if (e.nativeEvent.position === (this.props.data.length - 1)) this.setState({ buttonColor: '#8BC34A', textButton: 'Finish', currentSlide: e.nativeEvent.position });
		else this.setState({ buttonColor: '#388E3C', textButton: 'Skip', currentSlide: e.nativeEvent.position });
	}

	renderPagination() {
		const pages = [];
		const size = this.props.data.length;

		for (let i = 0; i < size; i++) {
			if (i === this.state.currentSlide) {
				pages.push(<View style={{ backgroundColor: '#8BC34A', flex: 1, borderRadius: 10, width: 10, height: 10, marginRight: 1, marginLeft: 1 }} />);
			} else {
				pages.push(<View style={{ backgroundColor: '#ffffff', flex: 1, borderRadius: 10, width: 10, height: 10, marginRight: 1, marginLeft: 1 }} />);
			}
		}

		return (
			<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20, marginTop: 20 }}>
				{pages}
			</View>
		);
	}

	renderSlide(slide) {
		const { slideStyle, slideTextStyle, slideTitleStyle } = styles;
		return (
			<View
				keyExtractor={(myslide) => myslide.pageId}
				style={slideStyle}
			>
				<Text style={slideTitleStyle}>{slide.title}</Text>
				<Text style={slideTextStyle}>{slide.text}</Text>
				<Image resizeMode='contain' style={{ width: '140%', flex: 8, marginTop: 5 }} source={slide.imgFile} />
			</View>
		);
	}

	renderSlides() {
		return this.props.data.map((slide) =>
			this.renderSlide(slide)
		);
	}

	render() {
		return (
			<View style={styles.SlidesContainer}>

				<ViewPagerAndroid
					initialPage={0}
					style={styles.ContPager}
					onPageSelected={this.updatePagination.bind(this)}
				>
					{this.renderSlides()}
				</ViewPagerAndroid>

				{this.renderPagination()}

				<Button
          buttonStyle={styles.reverseButtonStyle}
					backgroundColor={this.state.buttonColor}
          title={this.state.textButton}
          underlayColor='#388E3C'
          onPress={this.onButtonPress.bind(this)}
        />

			</View>
		);
	}
}

const styles = {
	SlidesContainer: {
		flex: 1,
		paddingBottom: 20,
		paddingTop: 10,
		paddingLeft: 10,
		paddingRight: 10,
		backgroundColor: '#388E3C'
	},
	ContPager: {
		flex: 3,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	reverseButtonStyle: {
		borderColor: '#ffffff',
		borderWidth: 1
	},
	slideStyle: {
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 5,
	},
	slideTitleStyle: {
		fontSize: 22,
		fontWeight: 'bold',
		padding: 5,
		flex: 1,
		color: '#ffffff',
		width: '100%',
		textAlign: 'center'
	},
	slideTextStyle: {
		fontSize: 14,
		flex: 2,
		textAlign: 'center',
		paddingLeft: 4,
		paddingRight: 4,
		color: '#ffffff'
	},
	buttonStyle: {
		justifyContent: 'center',
		alignItems: 'center'
	}
};


export default Slides;
