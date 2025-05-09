/**
 * 鼠标拖尾特效类
 * 实现原理：
 * 1. 监听鼠标移动事件
 * 2. 动态创建拖尾点元素
 * 3. 使用队列管理拖尾点生命周期
 * 4. 通过缩放和透明度实现拖尾渐变效果
 */
class MouseTrail {
    constructor() {
        try {
            this.canvas = document.getElementById('mouse-trail');
            if (!this.canvas) {
                console.error('找不到 mouse-trail canvas 元素');
                return;
            }
            
            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) {
                console.error('无法获取 canvas 上下文');
                return;
            }

            this.points = [];
            this.maxPoints = 50;
            this.mouse = { x: 0, y: 0 };
            this.lastMouse = { x: 0, y: 0 };
            this.velocity = { x: 0, y: 0 };
            this.friction = 0.95;
            this.trailLength = 20;

            this.resize();
            this.init();
            this.animate();

            console.log('MouseTrail 初始化成功');
        } catch (error) {
            console.error('MouseTrail 初始化失败:', error);
        }
    }

    resize() {
        try {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            console.log('Canvas 尺寸已更新:', this.canvas.width, 'x', this.canvas.height);
        } catch (error) {
            console.error('调整 Canvas 尺寸失败:', error);
        }
    }

    init() {
        try {
            window.addEventListener('resize', () => this.resize());
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });
            console.log('事件监听器已添加');
        } catch (error) {
            console.error('初始化事件监听器失败:', error);
        }
    }

    addPoint(x, y) {
        try {
            this.points.push({
                x,
                y,
                vx: this.velocity.x,
                vy: this.velocity.y,
                life: 1
            });

            if (this.points.length > this.maxPoints) {
                this.points.shift();
            }
        } catch (error) {
            console.error('添加点失败:', error);
        }
    }

    updatePoints() {
        try {
            // 计算速度
            this.velocity.x = (this.mouse.x - this.lastMouse.x) * 0.5;
            this.velocity.y = (this.mouse.y - this.lastMouse.y) * 0.5;

            // 添加新点
            this.addPoint(this.mouse.x, this.mouse.y);

            // 更新所有点的位置和生命周期
            for (let i = 0; i < this.points.length; i++) {
                const point = this.points[i];
                
                // 应用惯性
                point.x += point.vx;
                point.y += point.vy;
                
                // 应用摩擦力
                point.vx *= this.friction;
                point.vy *= this.friction;
                
                // 更新生命周期
                point.life -= 0.01;
            }

            // 移除死亡的点
            this.points = this.points.filter(point => point.life > 0);

            // 更新上一帧鼠标位置
            this.lastMouse.x = this.mouse.x;
            this.lastMouse.y = this.mouse.y;
        } catch (error) {
            console.error('更新点失败:', error);
        }
    }

    draw() {
        try {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // 绘制拖尾
            for (let i = 0; i < this.points.length - 1; i++) {
                const point = this.points[i];
                const nextPoint = this.points[i + 1];

                // 计算渐变颜色
                const gradient = this.ctx.createLinearGradient(
                    point.x, point.y,
                    nextPoint.x, nextPoint.y
                );

                // 根据生命周期设置颜色
                const alpha = point.life;
                gradient.addColorStop(0, `rgba(0, 255, 255, ${alpha})`);
                gradient.addColorStop(1, `rgba(255, 0, 255, ${alpha * 0.5})`);

                // 绘制线条
                this.ctx.beginPath();
                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = 3 * point.life;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.moveTo(point.x, point.y);
                this.ctx.lineTo(nextPoint.x, nextPoint.y);
                this.ctx.stroke();

                // 添加发光效果
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = `rgba(0, 255, 255, ${alpha * 0.5})`;
            }
        } catch (error) {
            console.error('绘制失败:', error);
        }
    }

    animate() {
        try {
            this.updatePoints();
            this.draw();
            requestAnimationFrame(() => this.animate());
        } catch (error) {
            console.error('动画循环失败:', error);
        }
    }
}

// 等待 DOM 加载完成后再初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 加载完成，初始化 MouseTrail');
    new MouseTrail();
});