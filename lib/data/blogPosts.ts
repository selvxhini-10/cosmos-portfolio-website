// lib/blogPosts.ts
import { BlogPost } from "../types/blog"

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "fine-tuned-sentiment-analysis",
    title: "Fine-Tuned Sentiment Analysis with LoRA and DistilBERT",
    excerpt: "Movie review sentiment analysis using a fine-tuned DistilBERT transformer model. The model is trained and evaluated on the IMDb dataset with Hugging Face’s Transformers library and accelerated with CUDA on an NVIDIA GeForce RTX 4060 Laptop GPU. Fine-tuning is performed using Low-Rank Adaptation (LoRA) with Parameter-Efficient Fine-Tuning (PEFT), integrated into Hugging Face’s Trainer API. Inference is deployed through a Streamlit web application displaying predicted sentiment labels (positive/negative), confidence scores and runtime device information (CPU/GPU).",
    content: `
## **Introduction**

This project implements a movie review sentiment analysis system using a fine-tuned DistilBERT transformer model. The model is trained and evaluated on the IMDb dataset using Hugging Face’s Transformers library, with GPU acceleration via CUDA on an NVIDIA GeForce RTX 4060 Laptop GPU.

## **How Does Fine-Tuning Work?**

Large Language Models (LLMs) are pre-trained on massive, generalized datasets to learn broad linguistic patterns. This generalization often lacks the specialization required for domain-specific applications such as sentiment analysis, customer support automation, or legal document review.

Traditional full fine-tuning updates all model parameters, which can be computationally expensive and time-consuming, often demanding hours or days of training and large amounts of GPU memory (VRAM).

## **Parameter-Efficient Fine-Tuning with LoRA**

To address these limitations, this project uses **LoRA (Low-Rank Adaptation)**, a parameter-efficient fine-tuning (PEFT) technique. Instead of updating all model weights, LoRA inserts small, trainable low-rank matrices into selected attention layers of the transformer.

**What was trained:**
The base DistilBERT model weights were not fine-tuned directly and remained frozen. Only the LoRA adapter parameters were trained, which were stored separately from the base model. During inference, the adapters are dynamically applied on top of the frozen base model. 

## **QLoRA (Conceptual Extension)**
Quantized Low-Rank Adaptation (QLoRA) combines PEFT with model quantization, allowing large models to be fine-tuned on consumer GPUs by reducing memory footprint.

## **Why Hugging Face Trainer and Pipeline Were Used**
The Hugging Face Trainer API was used to standardize and simplify the training of transformer models. It abstracts away much of the boilerplate required for training, including the forward and backward passes, gradient updates, batching, GPU/CPU device placement, logging, checkpointing, and evaluation scheduling. Without the Trainer, a custom PyTorch training loop would be required, which significantly increases complexity.

## **Model Performance Evaluation Workflow**
After fine-tuning the DistilBERT sentiment classification model, an evaluation pipeline objectively measures its performance on unseen data. Evaluation was conducted using the IMDb test split, ensuring that the model was assessed on reviews it had not encountered during training. 

Results indicate strong generalization to unseen IMDb reviews.

## **Performance Metrics**

- Accuracy:  0.8919
- Precision: 0.882
- Recall:    0.9044
- F1 Score:  0.8933


## **Fine-Tuning vs. Retrieval-Augmented Generation (RAG)**
RAG is best used for question-answering systems that require access to external or frequently changing knowledge. In a RAG setup, an LLM retrieves relevant documents from an external knowledge base and uses them as additional context when generating responses, reducing hallucination risks. 

In contrast, fine-tuning modifies the model’s parameters to improve performance on a specialized task or domain. This approach has several drawbacks: model performance depends heavily on the quality and size of the training data, the model may forget knowledge acquired during pretraining and it may lack real-world knowledge beyond what is present in the fine-tuning dataset. 

For very large models (e.g., GPT-4-scale systems with hundreds of billions or trillions of parameters), RAG is generally preferred over fine-tuning due to the computational cost and risks associated with modifying such large models. In this project, fine-tuning was the appropriate choice because distilbert-base-uncased is a relatively small model with approximately 66 million parameters. 

`,
    date: "2025-01-04",
    readTime: "4 min read",
    tags: ["Finetuning", "LoRA", "PEFT", "Transformers", "NVIDIA CUDA & PyTorch"],
    featured: true,
  },
  {
    id: 2,
    title: "The Impact of AI-driven Government Surveillance on Democracy and Liberty",
    slug: "ai-surveillance-democracy",

    excerpt: "      Imagine a world where AI is weaponized as a mass surveillance tool and knows us better than we know ourselves. This paper will explore the harmful applications of facial recognition technologies and their potential for accelerating totalitarianism through an Orwellian surveillance system.",
    content: `
## Research Paper

Link: https://drive.google.com/file/d/1nA_qruzSoqxLo56r8ris7LC3wen9pfBW/view

<iframe
  src="/pdfs/article1.pdf#view=FitH"
  width="100%"
  height="600"
  style="border: none;"
></iframe>

    `,
    date: "2024-11-27",
    readTime: "10 min read",
    tags: ["AI Surveillance", "Democracy", "Liberty", "Facial Recognition"],
    featured: true,
  },
  {
    id: 3,
    title: "Harnessing Convolutional Neural Networks to Discover Exoplanets ",
    slug: "cnn-exoplanets-discovery",
    excerpt: "Somewhere in the universe, there are distant Earth-like planets that could harbour life. These exoplanets can help us understand the origin, evolution and future of life and how solar systems and planets are formed. But a question arises: how can we find these distant worlds? The answer lies in convolutional neural networks.",
    content: `
## Research Paper

Link: https://drive.google.com/file/d/14mkOAs59vQ331fZRdJpXxSN_8QWWbUHB/view

<iframe
  src="/pdfs/article2.pdf#view=FitH"
  width="100%"
  height="600"
  style="border: none;"
></iframe>

    `,
    date: "2024-10-10",
    readTime: "4 min read",
    tags: ["Convolutional Neural Networks", "Research"],
    featured: false,
  },
  {
    id: 4,
    title: "AssistWave Project Proposal",
    slug: "assistwave-project-proposal",
    excerpt: "Due to immobilization, patients often struggle to perform basic tasks independently. AssistWave is an STM32 device that uses hand gesture recognition to help individuals with TSCI communicate their needs—such as eating, drinking, restroom use, and emergencies—to caregivers within a home setting.",
     content: `
## Research Paper

Link: https://drive.google.com/file/d/1IbamF4UMwRatZZMHT8ueOMVALaaFU5g_/view

<iframe
  src="/pdfs/article3.pdf#view=FitH"
  width="100%"
  height="600"
  style="border: none;"
></iframe>

    `,
    date: "2024-09-18",
    readTime: "10 min read",
    tags: ["STM32", "C++", "UART Communication"],
    featured: true,
  },
  {
    id: 5,
    slug: "traffix",
    title: "TraffiX: Leveraging Machine Learning for Smarter Traffic Management in Toronto",
    excerpt: "Our team believes in leveraging the power of artificial intelligence and technology for social and economic good. As residents and frequent visitors of Toronto, we have personally experienced the frustrating and often costly impacts of traffic congestion....",
     content: `
## Research Paper

Link: https://drive.google.com/file/d/1Sg_4v5RyHUJS3pEUtBXpeM-g8rV_P91m/view

<iframe
  src="/pdfs/article4.pdf#view=FitH"
  width="100%"
  height="600"
  style="border: none;"
></iframe>

    `,
    date: "2025-03-08",
    readTime: "8 min read",
    tags: ["AI", "Traffic Data Analysis"],
    featured: false,
  },
]
