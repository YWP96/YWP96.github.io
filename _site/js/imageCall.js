const imageUrls = [];

// 이미지를 A4 용지 크기로 조정하여 저장
window.addEventListener('load', function () {
    document.getElementById("save-button").addEventListener("click", function () {
        debugger;
        cmn.alert("저장 하시겠습니까?", function (confirmed) {
            if (confirmed) {
                const adjustedImages = [];

                function adjustImages(index) {
                    if (index < imageUrls.length) {
                        const imageUrl = imageUrls[index];
                        resizeImageToA4(imageUrl, function (blob) {
                            adjustedImages.push(blob);
                            adjustImages(index + 1);
                        });
                    } else {
                        const mergedBlob = new Blob(adjustedImages, { type: "image/jpeg" });

                        const anchor = document.createElement("a");
                        anchor.download = "my_file.jpeg";
                        anchor.href = URL.createObjectURL(mergedBlob);
                        anchor.style.display = "none";
                        document.body.appendChild(anchor);
                        anchor.click();
                        document.body.removeChild(anchor);
                    }
                }

                adjustImages(0);
            }
        });
    });
});

function displayAndEditImages() {
    const imageContainer = document.querySelector('.image-container');
    imageContainer.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        const imageItem = document.createElement('div');
        imageItem.classList.add('image-item');

        if (i < imageUrls.length) {
            const img = document.createElement('img');
            img.src = imageUrls[i];
            img.alt = 'Image';
            imageItem.appendChild(img);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '삭제';
            deleteButton.addEventListener('click', () => {
                deleteImage(i);
            });
            imageItem.appendChild(deleteButton);
        } else {
            imageItem.classList.add('empty');
            imageItem.textContent = 'image';
        }

        imageContainer.appendChild(imageItem);
    }
}

function deleteImage(index) {
    if (index >= 0 && index < imageUrls.length) {
        imageUrls.splice(index, 1);
        displayAndEditImages();
    }
}

const insertImageButton = document.getElementById('insert-image-button');
const imageUploadButton = document.getElementById('image-upload');

insertImageButton.addEventListener('click', () => {
    imageUploadButton.click();
});

imageUploadButton.addEventListener('change', (event) => {
    const files = event.target.files;
    for (const file of files) {
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            imageUrls.push(imageUrl);
        }
    }
    displayAndEditImages();
});

window.addEventListener('load', displayAndEditImages);




function resizeImageToA4(imageUrl, callback) {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // A4 용지 크기 (210mm x 297mm)로 설정
        canvas.width = 595; // 약 8.27 인치
        canvas.height = 842; // 약 11.69 인치

        // 이미지를 A4 크기로 그리기 (비율 유지)
        const aspectRatio = img.width / img.height;
        let newWidth, newHeight;

        if (aspectRatio > 1) {
            newWidth = canvas.width;
            newHeight = newWidth / aspectRatio;
        } else {
            newHeight = canvas.height;
            newWidth = newHeight * aspectRatio;
        }

        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // 조정된 이미지를 Blob으로 변환하여 콜백으로 전달
        canvas.toBlob((blob) => {
            callback(blob);
        }, 'image/jpeg', 0.95); // 이미지 포맷 및 품질 설정
    };
}