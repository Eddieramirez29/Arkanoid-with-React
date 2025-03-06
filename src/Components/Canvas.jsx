import { useEffect, useRef, useState } from 'react';

const Canvas = () =>
{
    const canvasRef = useRef(null);
    const delta_x_styles = useRef(0);
    const [initialPosition, setInitialPosition] = useState(true); // For sphere and paddle
    // Variables and constants for the paddle
    const xRef = useRef(300);
    const xRefPrev = useRef(300);
    const Y = 475;
    const RECT_WIDTH = 125;
    const RECT_HEIGHT = 25;
    const DISPLACEMENT_X = 25;
    //Variables related to right up movement
    const yRef_sphere = useRef(462);
    const yRefPrev_sphere = useRef(462);
    // Variables and constants for the sphere
    const xRef_sphere = useRef(362);// X position 362 is the center
    const xRefPrev_sphere = useRef(362);
    const SPHERE_CENTER_X = 362; // X position 362 is the center
    const SPHERE_CENTER_Y = 462; // Y position 462
    const SPHERE_RADIUS = 12; // Sphere radius
    const sphereOnMovement = useRef(false);
    const starting = useRef(0);
    //If it is (+25, -25), then goes to the right-up, otherwise(-25, -25) to the left-up
    //If it is (-25, 25), then goes to the left-down, otherwise(25, 25) to the right-down
    const x_displacement_sphere = useRef(25);
    const y_displacement_sphere = useRef(-25);
    const randomLeftRightDirection = Math.floor(Math.random() * 2) + 1;

    useEffect(() =>
    {
        const handleKeyPress = (event) =>
        {
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft')
            {
                setTimeout(() =>
                {
                    const isRight = event.key === 'ArrowRight';
                    delta_x_styles.current = isRight ? DISPLACEMENT_X : -DISPLACEMENT_X;
                    erasePallet();
                
                    if (!sphereOnMovement.current)
                    {
                        eraseSphere();
                        isRight ? drawSphereRightPosition() : drawSphereLeftPosition();
                    }
                
                    isRight ? drawNewRightPosition() : drawNewLeftPosition();
                }, 10);
            }
            
            // When pressing Enter, it starts the diagonal movement to the right-up
            if (event.key === 'Enter')
            {
                sphereOnMovement.current = true;

                // Sets the initial direction diagonally upwards, randomly choosing left or right.
                if (randomLeftRightDirection === 1)
                {
                    x_displacement_sphere.current = -25;
                    y_displacement_sphere.current = -25;
                }
                else
                {
                    x_displacement_sphere.current = 25;
                    y_displacement_sphere.current = -25;
                }

        setInterval(() =>
        {
            ballAndItsWallLimitsAndItsBounces();
            eraseSphereOnMovement();
            sphereMovement();
            //It detects when the sphere touches the pallet left-up
            if((yRef_sphere.current >= Y - 36 &&
                xRef_sphere.current >= xRef.current &&
                xRef_sphere.current <= xRef.current + 50)  && starting.current === 1)
            {
                x_displacement_sphere.current = -25;
                y_displacement_sphere.current = -25;
            }

            if((yRef_sphere.current >= Y - 36 &&
                xRef_sphere.current >= xRef.current + 51 &&
                xRef_sphere.current <= xRef.current + 75)  && starting.current === 1)
            {
                x_displacement_sphere.current = 0;
                y_displacement_sphere.current = -25;
            }

            //It detects when the sphere touches the pallet right-up
            if((yRef_sphere.current >= Y - 36 &&
                xRef_sphere.current >= xRef.current + 76 &&
                xRef_sphere.current <= xRef.current + 125)  && starting.current === 1)
            {
                x_displacement_sphere.current = 25;
                y_displacement_sphere.current = -25;
            }
            starting.current = 1;
        }, 100);
    }
        };
        
        document.addEventListener('keydown', handleKeyPress);
        
        return () =>
        {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

const ballAndItsWallLimitsAndItsBounces = () =>
{
    // Bounce on the left boundary (value: 12)
    // When the ball reaches the left boundary and is moving left,
    // we check its vertical movement to determine its diagonal direction.
    // If moving left-up (-25, -25), it should become right-up (+25, -25).
    // If moving left-down (-25, +25), it should become right-down (+25, +25).
    if (xRef_sphere.current <= 12)
    {
        if (x_displacement_sphere.current < 0)
        {
            if (y_displacement_sphere.current === -25)
            {
                // Ball moving left-up (-25, -25) -> becomes right-up (+25, -25)
                x_displacement_sphere.current = 25;
            }
            else if (y_displacement_sphere.current === 25)
            {
                // Ball moving left-down (-25, +25) -> becomes right-down (+25, +25)
                x_displacement_sphere.current = 25;
            }
        }
    }

    // Bounce on the right boundary (value: 701)
    // When the ball reaches the right boundary and is moving right,
    // we check its vertical movement to determine its diagonal direction.
    // If moving right-up (+25, -25), it should become left-up (-25, -25).
    // If moving right-down (+25, +25), it should become left-down (-25, +25).
    if (xRef_sphere.current >= 701)
    {
        if (x_displacement_sphere.current > 0)
        {
            if (y_displacement_sphere.current === -25)
            {
                // Ball moving right-up (+25, -25) -> becomes left-up (-25, -25)
                x_displacement_sphere.current = -25;
            }
            else if (y_displacement_sphere.current === 25)
            {
                // Ball moving right-down (+25, +25) -> becomes left-down (-25, +25)
                x_displacement_sphere.current = -25;
            }
        }
    }

    // Bounce on the top boundary (value: 12)
    // When the ball reaches the top boundary and is moving upward,
    // we check its horizontal movement to determine its diagonal direction.
    // If moving left-up (-25, -25), it should become left-down (-25, +25).
    // If moving right-up (+25, -25), it should become right-down (+25, +25).
    if (yRef_sphere.current <= 12)
    {
        if (y_displacement_sphere.current < 0)
        {
            if (x_displacement_sphere.current === -25)
            {
                // Ball moving left-up (-25, -25) -> becomes left-down (-25, +25)
                y_displacement_sphere.current = 25;
            }
            else if (x_displacement_sphere.current === 25)
            {
                // Ball moving right-up (+25, -25) -> becomes right-down (+25, +25)
                y_displacement_sphere.current = 25;
            }
        }
    }

    //If the sphere touches the pallet's center, it will bounce straight-up
    //It will touch the top part and it'll be back down in a straight line
    if(yRef_sphere.current <= 12 && x_displacement_sphere.current === 0)
    {
        x_displacement_sphere.current = 0;
        y_displacement_sphere.current = 25;
    }


    // If it touches the bottom boundary (value: 534), it stops and reloads the page
    if (yRef_sphere.current >= 534 && y_displacement_sphere.current > 0)
    {
        x_displacement_sphere.current = 0;
        y_displacement_sphere.current = 0;
        setTimeout(() =>
        {
            location.reload();
        }, 1000);
    }
}

    const drawNewLeftPosition = () =>
    {
        // Get Canvas context
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Coordinates X, Y (Initial position. This is the x center and it is 50px from the bottom)
        xRef.current = xRef.current - DISPLACEMENT_X;
        xRefPrev.current = xRef.current;
        if(xRef.current <= 0)
        {
            xRef.current = 0;
        }
        
        // Draw the paddle with enhanced style
        drawPallet(ctx, xRef.current, Y, RECT_WIDTH, RECT_HEIGHT);
    }

    const drawNewRightPosition = () =>
    {
        // Get Canvas context
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
    
        // Coordinates X, Y (Initial position. This is the x center and it is 50px from the bottom)
        xRef.current = xRef.current + DISPLACEMENT_X;
        xRefPrev.current = xRef.current;
        if(xRef.current >= 600)
        {
            xRef.current = 600;
        }

        // Draw the paddle with enhanced style
        drawPallet(ctx, xRef.current, Y, RECT_WIDTH, RECT_HEIGHT);
    }

    const erasePallet = () =>
    {
        // Get Canvas context
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Erase paddle
        ctx.clearRect(xRefPrev.current, Y, RECT_WIDTH, RECT_HEIGHT);
    }

    const eraseSphere = () => {
        // Get Canvas context
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
    
        // Draw a circle with the background gradient to cover the previous sphere
        ctx.beginPath();
        ctx.arc(xRefPrev_sphere.current, SPHERE_CENTER_Y, SPHERE_RADIUS, 0, Math.PI * 2);//Draw the sphere, but with no color
        ctx.closePath();
    
        const gradient = ctx.createLinearGradient(
            xRefPrev_sphere.current - SPHERE_RADIUS, SPHERE_CENTER_Y - SPHERE_RADIUS,
            xRefPrev_sphere.current + SPHERE_RADIUS, SPHERE_CENTER_Y + SPHERE_RADIUS
        );

        gradient.addColorStop(0, "#1f1f1f");
        gradient.addColorStop(1, "#232323");

        ctx.fillStyle = gradient;
        ctx.fill();
    }
    
    const eraseSphereOnMovement = () => {
        // Get Canvas context
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
    
        // Draw a circle with the background gradient to cover the previous sphere
        ctx.beginPath();
        ctx.arc(xRefPrev_sphere.current, yRefPrev_sphere.current, SPHERE_RADIUS, 0, Math.PI * 2);//Draw the sphere, but with no color
        ctx.closePath();
    
        const gradient = ctx.createLinearGradient(
            xRefPrev_sphere.current - SPHERE_RADIUS, yRefPrev_sphere.current - SPHERE_RADIUS,
            xRefPrev_sphere.current + SPHERE_RADIUS, yRefPrev_sphere.current + SPHERE_RADIUS
        );

        gradient.addColorStop(0, "#1f1f1f");
        gradient.addColorStop(1, "#232323");

        ctx.fillStyle = gradient;
        ctx.fill();
    }

    const drawPallet = (ctx, x, y, width, height) =>
    {
        // Rounded borders
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 10); // 10px radius for rounded borders
        ctx.closePath();

        // Gradient
        const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
        gradient.addColorStop(0, '#27CE90'); // Initial color
        gradient.addColorStop(1, '#1E90FF'); // Final color

        // Fill with gradient
        ctx.fillStyle = gradient;
        ctx.fill();

    }

    const drawInitialPosition = () =>
    {
        // Get Canvas context
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Draw initial paddle
        drawPallet(ctx, xRef.current, Y, RECT_WIDTH, RECT_HEIGHT);
    }

    // This function is for setting all the sphere styles in right-up movement
    function sphereRightUp45Styles(canvas)
    {
        const ctx = canvas.getContext("2d");
        const parameters = {}; // saves ctx and gradient for returning them

        parameters[0] = ctx;

        // Create a radial gradient to simulate internal glow and multiple colors
        const gradient = ctx.createRadialGradient(xRef_sphere.current + x_displacement_sphere.current, yRef_sphere.current + y_displacement_sphere.current, 2, xRef_sphere.current + x_displacement_sphere.current, yRef_sphere.current + y_displacement_sphere.current, SPHERE_RADIUS);
        gradient.addColorStop(0, "#FFFFFF");  // Bright white center
        gradient.addColorStop(0.3, "#00A0FF"); // Intense blue
        gradient.addColorStop(0.5, "#FF00FF"); // Magenta
        gradient.addColorStop(0.7, "#FFE600"); // Yellow
        gradient.addColorStop(0.9, "#FF4500"); // Orange/reddish
        gradient.addColorStop(0.95, "#1f1f1f"); // Start of dark border gradient
        gradient.addColorStop(1, "#232323");   // End of dark border gradient
        parameters[1] = gradient;

        return parameters;
    }

    // This function is for setting all the sphere styles in horizontal movement
    //This is for setting styles when the sphere is moving 45° to the right
    function sphereStyles(canvas)
    {
        const ctx = canvas.getContext("2d");
        const parameters = {}; // saves ctx and gradient for returning them

        parameters[0] = ctx;

        if(xRef_sphere.current >= 638 && delta_x_styles.current === DISPLACEMENT_X)
        {
            xRef_sphere.current = 638;
        }

        if(xRef_sphere.current <= 87 && delta_x_styles.current === -DISPLACEMENT_X)
        {
            xRef_sphere.current = 87;
        }

        // Create a radial gradient to simulate internal glow and multiple colors
        const gradient = ctx.createRadialGradient(xRef_sphere.current + delta_x_styles.current, SPHERE_CENTER_Y, 2, xRef_sphere.current + delta_x_styles.current, SPHERE_CENTER_Y, SPHERE_RADIUS);
        gradient.addColorStop(0, "#FFFFFF");  // Bright white center
        gradient.addColorStop(0.3, "#00A0FF"); // Intense blue
        gradient.addColorStop(0.5, "#FF00FF"); // Magenta
        gradient.addColorStop(0.7, "#FFE600"); // Yellow
        gradient.addColorStop(0.9, "#FF4500"); // Orange/reddish
        gradient.addColorStop(0.95, "#1f1f1f"); // Start of dark border gradient
        gradient.addColorStop(1, "#232323");   // End of dark border gradient
        parameters[1] = gradient;

        return parameters;
    }

    const sphereMovement = () =>
    {
        const canvas = canvasRef.current;
        const parameters = sphereRightUp45Styles(canvas);
    
        xRef_sphere.current += x_displacement_sphere.current;
        yRef_sphere.current += y_displacement_sphere.current;

        xRefPrev_sphere.current = xRef_sphere.current;
        yRefPrev_sphere.current = yRef_sphere.current;

        // Draw sphere
        parameters[0].beginPath();
        parameters[0].arc(xRef_sphere.current, yRef_sphere.current, SPHERE_RADIUS, 0, Math.PI * 2);
        parameters[0].closePath();

        parameters[0].fillStyle = parameters[1];
        parameters[0].fill();
    }

    const drawSphereRightPosition = () =>
    {
        const canvas = canvasRef.current;
        const parameters = sphereStyles(canvas);

        xRef_sphere.current = xRef_sphere.current + DISPLACEMENT_X;
        xRefPrev_sphere.current = xRef_sphere.current;
        if(xRef_sphere.current >= 662)
        {
            xRef_sphere.current = 662;
        }
        // Draw sphere
        parameters[0].beginPath();
        parameters[0].arc(xRef_sphere.current, SPHERE_CENTER_Y, SPHERE_RADIUS, 0, Math.PI * 2);
        parameters[0].closePath();
    
        parameters[0].fillStyle = parameters[1];
        parameters[0].fill();
    }

    const drawSphereLeftPosition = () =>
    {
        const canvas = canvasRef.current;
        const parameters = sphereStyles(canvas);

        xRef_sphere.current = xRef_sphere.current - DISPLACEMENT_X;
        xRefPrev_sphere.current = xRef_sphere.current;
        if(xRef_sphere.current <= 63)
        {
            xRef_sphere.current = 63;
        }

        // Draw sphere
        parameters[0].beginPath();
        parameters[0].arc(xRef_sphere.current, SPHERE_CENTER_Y, SPHERE_RADIUS, 0, Math.PI * 2);
        parameters[0].closePath();

        parameters[0].fillStyle = parameters[1];
        parameters[0].fill();
    }

    const drawSphereInitialPosition = () =>
    {
        const canvas = canvasRef.current;
        const parameters = sphereStyles(canvas);

        // Draw sphere
        parameters[0].beginPath();
        parameters[0].arc(SPHERE_CENTER_X, SPHERE_CENTER_Y, SPHERE_RADIUS, 0, Math.PI * 2);
        parameters[0].closePath();

        parameters[0].fillStyle = parameters[1];
        parameters[0].fill();
    }

    useEffect(() =>
    {
        if(initialPosition)
        {
            drawInitialPosition();
            drawSphereInitialPosition();
            setInitialPosition(false);
        }
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width="725"
            height="550"
            style={{
                background: "linear-gradient(145deg, #1f1f1f, #232323)",
                border: "2px solid #444",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
            }}>
        </canvas>
    );
};

export default Canvas;