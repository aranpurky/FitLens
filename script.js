let score = 0;

async function startExercise(exercise) {
    const videoElement = document.getElementById(`video${getExerciseIndex(exercise)}`);
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = () => {
            videoElement.play();
            detectPose(videoElement, detector, exercise);
        };
    } catch (error) {
        alert("Camera permission is required to use FitLens. Please grant access to your camera.");
    }
}

async function detectPose(videoElement, detector, exercise) {
    const poses = await detector.estimatePoses(videoElement);
    const keypoints = poses[0]?.keypoints;

    if (keypoints) {
        if (isExerciseComplete(keypoints, exercise)) {
            score += 25;
            document.getElementById(`exercise${getExerciseIndex(exercise)}`).innerHTML = `<h3>${capitalizeFirstLetter(exercise)} Completed</h3>`;
            document.getElementById('scoreValue').innerText = score;
            stopVideo(videoElement);
        }
    }

    requestAnimationFrame(() => detectPose(videoElement, detector, exercise));
}

function isExerciseComplete(keypoints, exercise) {
    // Simple logic to check if the exercise is completed
    // For demonstration purposes, this should be replaced with actual pose detection logic
    switch (exercise) {
        case 'pushups':
            return keypoints[0].score > 0.5;
        case 'squats':
            return keypoints[0].score > 0.5;
        case 'jumpingJacks':
            return keypoints[0].score > 0.5;
        case 'plank':
            return keypoints[0].score > 0.5;
        default:
            return false;
    }
}

function stopVideo(videoElement) {
    const stream = videoElement.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(track => {
        track.stop();
    });

    videoElement.srcObject = null;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getExerciseIndex(exercise) {
    switch (exercise) {
        case 'pushups':
            return 1;
        case 'squats':
            return 2;
        case 'jumpingJacks':
            return 3;
        case 'plank':
            return 4;
        default:
            return 0;
    }
}
