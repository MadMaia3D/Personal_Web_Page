import * as Vector2 from "../../shared/vector2.js"
import { Vector2 as Vec2 } from "../../shared/vector2.js"
import { Remap } from "../../shared/utility.js"


export function Create(x, y, vx, vy, width, height) {
    const agent = {
        position: new Vec2(x, y),
        velocity: new Vec2(vx, vy),
        width: width,
        height: height,
        angle: 0,
        alignment_radius: 60,
        separation_radius: 25,
        cohesion_radius: 60,
        net_force: new Vec2(0, 0),
        max_force: 100,
        max_speed: 100
    };
    return agent;
};


export function DrawModel(agent, context) {
    const hw = agent.width / 2;
    const hh = agent.height / 2;

    context.beginPath();
    context.moveTo(0, 0 - hh);
    context.lineTo(0 + hw, 0 + hh);
    context.lineTo(0, 0 + hh * 0.7);
    context.lineTo(0 - hw, 0 + hh);
    context.closePath();

    context.stroke();
    context.fill();
}


export function DrawShadow(agent, context) {
    context.fillStyle = "#000";
    context.strokeStyle = "#000";
    context.save()
    context.translate(agent.position.x + 2, agent.position.y + 8);
    context.rotate(agent.angle + Math.PI / 2);
    DrawModel(agent, context);
    context.restore();
}


export function Draw(agent, context) {
    context.fillStyle = "#eee";
    context.strokeStyle = "#000";
    context.save()
    context.translate(agent.position.x, agent.position.y);
    context.rotate(agent.angle + Math.PI / 2);
    DrawModel(agent, context);
    context.restore();

    // context.beginPath();
    // context.strokeStyle = "#0f08";
    // context.arc(agent.position.x, agent.position.y, agent.alignment_radius, 0, Math.PI * 2);
    // context.stroke();
    // context.beginPath();
    // context.strokeStyle = "#ff08";
    // context.arc(agent.position.x, agent.position.y, agent.separation_radius, 0, Math.PI * 2);
    // context.stroke();
}


export function ApplyForce(agent, force) {
    agent.net_force.Add(force);
}


export function Update(agent, delta_time) {
    agent.net_force.Limit(agent.max_force).Mult(delta_time);
    agent.velocity.Add(agent.net_force).Limit(agent.max_speed);
    agent.net_force.Set(0, 0);
    
    agent.position.Add(Vector2.Mult(agent.velocity, delta_time));
    agent.angle = Math.atan2(agent.velocity.y, agent.velocity.x);
}


export function WrapAroundCanvas(agent, canvas) {
    const minor_axis = Math.max(agent.width, agent.height);
    if (agent.position.x < -minor_axis) { agent.position.x = canvas.width + minor_axis };
    if (agent.position.x > canvas.width + minor_axis) { agent.position.x = -minor_axis };
    if (agent.position.y < -minor_axis) { agent.position.y = canvas.height + minor_axis };
    if (agent.position.y > canvas.height + minor_axis) { agent.position.y = -minor_axis };
}


// Alignment: try to catch a position
export function Seek(agent, target_position) {
    const desired_velocity = Vector2.Sub(target_position, agent.position).SetLength(agent.max_speed);
    const steering = Vector2.Sub(desired_velocity, agent.velocity).Limit(agent.max_force);
    return steering;
}


// Alignment: try to catch a position
export function SeekNearby(agent, target_position, seek_distance) {
    if (!seek_distance) { seek_distance = agent.separation_radius; }

    let steering = new Vec2(0, 0);
    const distance_squared = Vector2.GetDistanceSquared(agent.position, target_position);
    
    if (distance_squared < seek_distance ** 2) {
        const desired_velocity = Vector2.Sub(target_position, agent.position).SetLength(agent.max_speed);
        steering = Vector2.Sub(desired_velocity, agent.velocity).Limit(agent.max_force);
    }
    return steering;
}


// Alignment: try to match neighboors velocities
export function Align(agent, agents_array) {
    const desired_velocity = new Vec2(0, 0);
    let count = 0;

    for (let i = 0; i < agents_array.length; i++) {
        const distance_squared = Vector2.GetDistanceSquared(agent.position, agents_array[i].position);
        if (distance_squared < agent.alignment_radius ** 2) {
            desired_velocity.Add(agents_array[i].velocity);
            count++;
        }
    }

    let steering = new Vec2(0, 0);
    if (count > 0) {
        desired_velocity.Div(count).SetLength(agent.max_speed);
        steering = Vector2.Sub(desired_velocity, agent.velocity).Limit(agent.max_force);
    }

    return steering;
}


// Separation: try to steer away from close neighboors
export function Separate(agent, agents_array) {
    const desired_velocity = new Vec2(0, 0);
    let count = 0;

    for (let i = 0; i < agents_array.length; i++) {
        if (agent === agents_array[i]) { continue; }

        const distance_squared = Vector2.GetDistanceSquared(agent.position, agents_array[i].position);

        if (distance_squared < agent.separation_radius ** 2) {
            const distance = Math.sqrt(distance_squared);
            const separation_intensity = Remap(distance, 0, agent.separation_radius, 1, 0);
            const separation_vector = Vector2.Sub(agent.position, agents_array[i].position).SetLength(separation_intensity);
            desired_velocity.Add(separation_vector);
            count++;
        }
    }

    if (count > 0) {
        desired_velocity.Div(count).SetLength(agent.max_speed);
        // const steering = Vector2.Sub(desired_velocity, agent.velocity).Limit(agent.max_force);
    }
    return desired_velocity;
}

// Separation: try to steer away from a single position
export function Avoid(agent, position, avoid_distance) {
    if (!avoid_distance) { avoid_distance = agent.separation_radius; }

    const desired_velocity = new Vec2(0, 0);
    let count = 0;

    const distance_squared = Vector2.GetDistanceSquared(agent.position, position);

    if (distance_squared < avoid_distance ** 2) {
        const distance = Math.sqrt(distance_squared);
        const separation_intensity = Remap(distance, 0, avoid_distance, 1, 0);
        const separation_vector = Vector2.Sub(agent.position, position).SetLength(separation_intensity);
        desired_velocity.Add(separation_vector);
        count++;
    }

    desired_velocity.SetLength(agent.max_speed);
    // const steering = Vector2.Sub(desired_velocity, agent.velocity).Limit(agent.max_force);
    return desired_velocity;
}


// Cohesion: move torwars the local center
export function Cohesion(agent, agents_array) {
    let average_position = new Vec2(0, 0);
    let count = 0;

    for (let i = 0; i < agents_array.length; i++) {
        if (agent === agents_array[i]) { continue; }
        const distance_squared = Vector2.GetDistanceSquared(agent.position, agents_array[i].position);

        if (distance_squared < agent.separation_radius ** 2) {
            average_position.Add(agents_array[i].position);
            count++;
        }
    }

    let steering = new Vec2(0, 0);
    if (count > 0) {
        average_position.Div(count);
        let desired_velocity = Vector2.Sub(average_position, agent.position).SetLength(agent.max_speed);
        steering = Vector2.Sub(desired_velocity, agent.velocity).Limit(agent.max_force);
    }
    return steering;
}
