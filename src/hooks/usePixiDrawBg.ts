function getImageUrl(name: string) {
	return new URL(`/src/assets/${name}`, import.meta.url).href
}

export default function usePixiDrawBg() {
	const { PIXI, innerWidth, innerHeight } = window
	const app = new PIXI.Application({ background: '#272d37', width: innerWidth, height: innerHeight })
	const canvas = app.view as HTMLCanvasElement

	onMounted(() => {
		canvas.className = 'fixed top-0 left-0 -z-1'
		document.body.appendChild(canvas)

		// 绘制背景
		const graphics = new PIXI.Graphics()
		const drawLine = (t: number, w: number, h: number) => {
			graphics.clear()
			graphics.lineStyle({ color: '0x409eff', width: 1, alpha: 0.1 })
			for (let i = -60; i < 60; i += 3) {
				graphics.moveTo(-200, h / 2)
				for (let j = 0; j < w; j += 1) {
					graphics.lineTo(
						10 * Math.sin(i / 10) + j + 0.008 * j * j,
						Math.floor(
							h / 2 +
							(j / 2) * Math.sin(j / 50 - t / 50 - i / 118) +
							i * 0.9 * Math.sin(j / 25 - (i + t) / 65)
						)
					)
				}
			}
			graphics.lineStyle({ color: '0xf56c6c', width: 1, alpha: 0.2 })
			for (let i = -20; i < 20; i += 3) {
				graphics.moveTo(-200, h / 2)
				for (let j = 0; j < w; j += 1) {
					graphics.lineTo(
						10 * Math.cos(i / 10) + j + 0.008 * j * j,
						Math.floor(
							h / 2 +
							(j / 2) * Math.cos(j / 50 - t / 50 - i / 118) +
							i * 0.9 * Math.cos(j / 25 - (i + t) / 65)
						)
					)
				}
			}
		}
		app.stage.addChild(graphics)

		// 绘制logo
		const logo = PIXI.Sprite.from(getImageUrl('logo.svg'))
		logo.anchor.set(0.5)
		logo.x = app.screen.width / 2
		logo.y = app.screen.height / 2
		app.stage.addChild(logo)

		// 绘制备案号文本
		const style = new PIXI.TextStyle({
			fontFamily: 'Arial',
			dropShadow: true,
			dropShadowAlpha: 0.5,
			dropShadowAngle: 2.1,
			dropShadowBlur: 2,
			dropShadowColor: '0x11111111',
			dropShadowDistance: 10,
			fill: ['#409eff'],
			fontSize: 16,
			fontWeight: 'lighter',
			lineJoin: 'round',
		})
		const text = new PIXI.Text('赣ICP备19012553号-1', style)
		text.anchor.set(0.5)
		text.x = app.screen.width / 2
		text.y = app.screen.height - 30
		app.stage.addChild(text)


		// 动画帧
		let count = 0
		app.ticker.add(() => {
			count += 1
			drawLine(count, innerWidth, innerHeight)
		})
	})

	onBeforeUnmount(() => {
		app.destroy()
		document.body.removeChild(canvas)
	})

	return {
	}
}
