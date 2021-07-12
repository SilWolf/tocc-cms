import styled from 'styled-components'

const Wrapper = styled.div`
	position: relative;
	padding-top: 5px;
	padding-bottom: 3px;
	text-align: center;
	.info {
		position: absolute;
		display: block;
		top: 10px;
		left: calc(50% + 28px);
		> span {
			letter-spacing: 0.5px;
			text-transform: uppercase;
			color: rgb(180, 182, 186);
			font-size: 11px;
			font-weight: 700;
		}
	}
	button {
		&:not(.isOpen):hover + .info {
			> span {
				color: #007eff;
			}
		}
	}
	.error-label {
		color: #f64d0a;
		font-size: 13px;
		margin-top: 4px;
		margin-bottom: -5px;
	}
`

export default Wrapper
