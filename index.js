const canvas = document.querySelector('canvas');
const scoreEl = document.querySelector('#scoreEl');
const c = canvas.getContext('2d');

console.log(scoreEl);
canvas.width = innerWidth;
canvas.height = innerHeight;


class Player{
    constructor(){
   

     this.velocity = {
        x:0,
        y:0
     }

     this.rotation = 0
     this.opacity = 1

     const image = new Image();
     image.src = "./img/Nave.png"
      image.onload=() => {
     this.image = image
     const scale = 0.15
     this.width = image.width * scale
     this.height = image.height * scale
     this.position = {
        x:canvas.width / 2 - this.width / 2, 
        y:canvas.height - this.height - 20
     }
      }
     
    }
    draw(){

        c.save()
        c.globalAlpha = this.opacity
        c.translate(player.position.x + player.width/2, player.position.y + player.height/2)
        c.rotate(this.rotation)

        c.translate( - player.position.x - player.width/2, - player.position.y - player.height/2)
    
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width, 
            this.height
            )
        c.restore()
        }

      update() {
        if(this.image){
        this.draw()
        this.position.x += this.velocity.x
        }
      }
    }

    class Projectile{
        constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.radius = 4
        }
        draw() {
            c.beginPath()
            c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
            c.fillStyle = "white"
            c.fill()
            c.closePath()
        }
        update(){
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
    
    class Particle{
        constructor({position, velocity, radius}){
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        this.opacity = 1
        }
        draw() {
            c,save()
            c.globalAlpha = this.opacity
            c.beginPath()
            c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
            c.fillStyle = this.color
            c.fill()
            c.closePath()
            c.restore()
        }
        update(){
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
            this.opacity -= 0.01
        }
    }

    class InvaderProjectile{
        constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.width = 3
        this.height =10
        }
        draw() {
            c.fillStyle= "red"
            c.fillRect(this.position.x, this.position.y, this.width, this.height)
        }
        update(){
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }

    class Demon{
        constructor({position}){
       
    
         this.velocity = {
            x:0,
            y:0
         }
    
         
    
         const image = new Image();
         image.src = "./img/demon.png"
          image.onload=() => {
         this.image = image
         const scale = 1
         this.width = image.width * scale
         this.height = image.height * scale
         this.position = {
            x:position.x,
            y:position.y
         }
          }
         
        }
        draw(){
    
            
        
            c.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width, 
                this.height
                )
            
            }
    
          update({velocity}) {
            if(this.image){
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
            }
          }
          shoot(invaderProjectiles){
            invaderProjectiles.push(new InvaderProjectile({
                position:{
                    x:this.position.x + this.width / 2,
                    y:this.position.y + this.height
                },
                velocity:{
                    x:0,
                    y:5
                }
            }))

          }
        }

class Grid {
    constructor(){
        this.position = {
            x:0,
            y:0
        }
        this.velocity = {
            x:3,
            y:0
        }
        this.demon = []
        const columns = 5
        const rows = 4

        this.width = columns * 270
        for (let x = 0; x< columns; x++) {
            for (let y = 0; y< rows; y++){
                  this.demon.push(new Demon({position: {
                x:x * 270,
                y:y * 130
            }
        })
        )
     }
          
        }
    }
    update(){
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
        
      this.velocity.y = 0

      if(this.position.x + this.width >= canvas.width || this.position.x <= 0){
        this.velocity.x = -this.velocity.x
        this.velocity.y = 30
      }
    }
}
    
const player = new Player ()
const Projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []
const keys = {
    a: {
        pressed: false
    },
    d:{
        pressed: false
    },
    space: {
        pressed: false
    }
}
let frames = 0
let ramdonInterval = (Math.random() * 500) + 500
let game = {
    over: false,
    active: true
}

let score= 0

function createParticles({object, color}) {
    for (let i = 0; i < 10; i++) {
        particles.push(new Projectile({
        position: {
            x: object.position.x + object.width/2,
            y: object.position.y + object.height/2
        },
        velocity:{
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
        },
        radius: Math.random() * 3,
        color: color || "yellow"
    }))
    }
}

function animate (){
    if(!game.active) return
    requestAnimationFrame(animate)
    c.fillStyle = "black" 
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    particles.forEach((particle, i) => {
        if(particle.position.y - particle.radius >= canvas.height){
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius  
        }
        if(particle.opacity > 0){
            setTimeout(() => {
                particles.splice(i, 1)
            }, 0)
        }else {
            particle.update()
        }
    })
    invaderProjectiles.forEach((invaderProjectile, index) => {
      if(invaderProjectile.position.y + invaderProjectile.height >= canvas.height){
        setTimeout(() => {
            invaderProjectiles.splice(index, 1)
        }, 0)
      }else invaderProjectile.update()

      if(invaderProjectile.position.y + invaderProjectile.height
         >= player.position.y && invaderProjectile.position.x 
         + invaderProjectile.width >= player.position.x &&
           invaderProjectile.position.x <= player.position.x 
         + player.width
         ){
        console.log( "Perdiste")
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
                player.opacity=0
                game.over = true
            }, 0)
            setTimeout(() => {
               game.active = false
            }, 4000)

        createParticles({
            object: player,
            color: "red"
        })
      }
    })
    Projectiles.forEach((projectile, index) => {
        if(projectile.position.y + projectile.radius <= 0) {
            Projectiles.splice(index, 1)
        } else {
           projectile.update() 
        }   
    })
    grids.forEach((grid, gridIndex) => {
        grid.update()
        if(frames % 100 === 0 && grid.demon.length > 0){
            grid.demon[Math.floor(Math.random() * grid.demon.length)].shoot(invaderProjectiles)
    }
        grid.demon.forEach((invader, i) => {
            invader.update({velocity: grid.velocity})


            Projectiles.forEach((projectiles, j) => {
                if (projectiles.position.y - projectiles.radius 
                      <= invader.position.y + invader.height
                     && projectiles.position.x + projectiles.radius >= invader.position.x 
                     && projectiles.position.x - projectiles.radius <= invader.position.x + invader.height
                     && projectiles.position.y + projectiles.radius >= invader.position.y){

                    
                    
                    setTimeout(() => {
                        const invaderFound = grid.demon.find(
                            (invaders) => invaders === invader

                        )
                        const projectilesFound = Projectiles.find(
                            (projectile2) => projectile2 === projectiles
                        ) 
                        if(invaderFound && projectilesFound){
                            score += 100
                            scoreEl.innerHTML = score
                            createParticles({
                                object: invader
                            })
                        grid.demon.splice(i, 1 )
                        Projectiles.splice(j, 1)

                        if(grid.demon.length > 0){
                            const firstInvader = grid.demon[0]
                            const lastInvader = grid.demon[grid.demon.length - 1]

                            grid.width = 
                            lastInvader.position.x 
                            - firstInvader.position.x
                            + lastInvader.width

                            grid.position.x = firstInvader.position.x
                        }else {
                            grids.splice(gridIndex, 1)
                        }
                        } 
                    }, 0)
                }
            })
        })
    }) 
  
    if (keys.a.pressed && player.position.x >= 0){
        player.velocity.x = -7
        player.rotation = -0.15
    } else if (keys.d.pressed && player.position.x + player.width <= canvas.width){
        player.velocity.x = 7
        player.rotation = 0.15
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }

    if(frames % ramdonInterval === 0){
        grids.push(new Grid())
    }

   
    frames ++
}

animate()

addEventListener("keydown", ({key}) => {
    if(game.over) return 
switch(key) {
    case "a":
        console.log("left")
        
        keys.a.pressed = true
        break
    case "d":
        console.log("right")
        keys.d.pressed = true
        break
    case " ":
        console.log("space")
        Projectiles.push(
            new Projectile({
                position: {
                    x:player.position.x + player.width / 2,
                    y:player.position.y
                },
                velocity: {
                    x:0,
                    y: - 10
                }
            })
        )
        break    
}
})

addEventListener("keyup", ({key}) => {
    switch(key) {
        case "a":
            console.log("left")
            keys.a.pressed = false
            break
        case "d":
            console.log("right")
            keys.d.pressed = false
            break
        case " ":
            console.log("space")
            break    
    }
    })