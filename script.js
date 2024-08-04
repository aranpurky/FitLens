let scores = {
    pushups: 0,
    squats: 0,
    jumpingJacks: 0,
    plank: 0
};

document.addEventListener('DOMContentLoaded', () => {
    showPage('intro');
});

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = page.id === pageId ? 'flex' : 'none';
    });
}

function navigateTo(pageId) {
    showPage(pageId);
}

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
        alert("Camera permission is required. Please grant access to your camera.");
    }
}

async function detectPose(videoElement, detector, exercise) {
    const poses = await detector.estimatePoses(videoElement);
    const keypoints = poses[0]?.keypoints;

    if (keypoints && isExerciseComplete(keypoints, exercise)) {
        scores[exercise] = 25;
        updateScores();
        stopVideo(videoElement);
        navigateTo(getNextPage(exercise));
    } else {
        // Add your own pose detection logic here
    }
}

function isExerciseComplete(keypoints, exercise) {
    // Replace with actual pose detection logic
    return keypoints[0]?.score > 0.5;
}

function stopVideo(videoElement) {
    const stream = videoElement.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    videoElement.srcObject = null;
}

function updateScores() {
    document.getElementById('pushupsScore').innerText = scores.pushups;
    document.getElementById('squatsScore').innerText = scores.squats;
    document.getElementById('jumpingJacksScore').innerText = scores.jumpingJacks;
    document.getElementById('plankScore').innerText = scores.plank;
    document.getElementById('totalScore').innerText = Object.values(scores).reduce((a, b) => a + b, 0);
}

function getExerciseIndex(exercise) {
    switch (exercise) {
        case 'pushups': return 1;
        case 'squats': return 2;
        case 'jumpingJacks': return 3;
        case 'plank': return 4;
    }
}

function getNextPage(exercise) {
    switch (exercise) {
        case 'pushups': return 'workout2';
        case 'squats': return 'workout3';
        case 'jumpingJacks': return 'workout4';
        case 'plank': return 'summary';
    }
}
