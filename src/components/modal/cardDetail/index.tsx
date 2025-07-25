import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, useActionData, useParams, useSubmit } from 'react-router';

import { getComments } from '@/apis/comment';
import MoreVertIcon from '@/assets/icons/MoreVertIcon';
import Avatar from '@/components/Avatar';
import Badge from '@/components/badge';
import Button from '@/components/common/button';
import Dialog from '@/components/common/dialog';
import Dropdown from '@/components/common/dropdown';
import Input from '@/components/common/input';
import Tag from '@/components/tag';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { type CommentsType, type CommentType, type CreateComment, createCommentSchema } from '@/schemas/comment';

import Comment from './Comment';
import SkeletonComment from './SkeletonComment';
import type { DetailType } from './types';

const CardDetail = ({ data, isModalOpen, toggleModal, toggleEditTodo, title }: DetailType) => {
  const params = useParams();
  const actionData = useActionData();
  const defaultValues: CreateComment = {
    columnId: data.columnId,
    content: '',
    cardId: data.id,
    dashboardId: Number(params.dashboardId),
  };
  const { register, reset, handleSubmit, getValues } = useForm<CreateComment>({
    defaultValues: defaultValues,
    resolver: zodResolver(createCommentSchema),
  });
  const [commentList, setCommentList] = useState<CommentsType>([]);
  const [cursorId, setCursorId] = useState<number | null>(null);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [selectedComment, setSelectedComment] = useState<CommentType | null>();
  const submit = useSubmit();
  const handleOptionSelect = async (value: string | number) => {
    if (value === 'edit') {
      toggleModal();
      toggleEditTodo();
    }

    if (value === 'delete') {
      const formData = new FormData();
      formData.append('intent', 'deleteTodo');
      formData.append('cardId', String(data.id));
      try {
        submit(formData, { method: 'delete' });
        toggleModal();
      } catch (error) {
        console.error('카드 삭제 실패:', error);
      }
    }
  };

  useEffect(() => {
    if (!isModalOpen || isCommentLoading) {
      return;
    }
    const fetch = async () => {
      const result = await getComments(data.id);
      setCommentList(result.comments);
      setCursorId(result.cursorId);
      setIsCommentLoading(false);
    };

    setIsCommentLoading(true);
    fetch();

    return () => setCommentList([]);
  }, [data.id, isModalOpen, actionData]);

  useEffect(() => {
    if (selectedComment) {
      reset({ ...getValues(), content: selectedComment.content });
    }
  }, [selectedComment]);

  const onSubmit = (submitData: CreateComment) => {
    const formData = new FormData();
    formData.append('intent', 'createComment');
    formData.append('content', submitData.content);
    formData.append('cardId', String(data.id));
    formData.append('columnId', String(data.columnId));
    formData.append('dashboardId', String(params.dashboardId));
    submit(formData, { method: 'post', encType: 'multipart/form-data' });
    reset();
  };

  const editSubmit = () => {
    const formData = new FormData();
    formData.append('intent', 'editComment');
    formData.append('content', getValues('content'));
    formData.append('commentId', String(selectedComment?.id));
    submit(formData, { method: 'put', encType: 'multipart/form-data' });
  };

  const deleteComment = (commentId: number) => {
    const formData = new FormData();
    formData.append('intent', 'deleteComment');
    formData.append('commentId', String(commentId));
    submit(formData, { method: 'delete', encType: 'multipart/form-data' });
  };

  const fetchMoreComment = async () => {
    if (cursorId === null || isCommentLoading) return;
    setIsCommentLoading(true);

    const moreComment = await getComments(data.id, cursorId);
    setCommentList((prev) => [...prev, ...moreComment.comments]);
    setCursorId(moreComment.cursorId);

    setIsCommentLoading(false);
  };
  const ref = useInfiniteScroll({ callback: fetchMoreComment, isMoreData: cursorId !== null });

  return (
    <Dialog.Root
      className='h-783 w-327 rounded-lg p-16 tablet:w-678 tablet:px-32 tablet:py-24 pc:w-730'
      isModalOpen={isModalOpen}
      toggleModal={() => {
        toggleModal();
        setSelectedComment(null);
      }}
    >
      <Dialog.Title className='w-7/8 text-[20px] font-bold tablet:text-2xl'>
        <div className='justify flex max-w-full items-center justify-between text-gray-700'>
          <h1>{data.title}</h1>
          <span>
            <Dropdown
              contentClassName=''
              optionAlign='center'
              optionClassName='text-center'
              options={[
                { label: '수정하기', value: 'edit' },
                { label: '삭제하기', value: 'delete' },
              ]}
              trigger={<MoreVertIcon aria-label='더보기 옵션' size={24} />}
              triggerClassName='px-2 py-1 '
              onSelect={handleOptionSelect}
            />
          </span>
        </div>
      </Dialog.Title>
      <Dialog.Close
        toggleModal={() => {
          toggleModal();
        }}
      />
      <Dialog.Content className='mt-10 flex grow-0 flex-col-reverse justify-between tablet:mt-24 tablet:flex-row tablet:gap-13'>
        <section className='tablet:w-420 pc:w-445'>
          <div className='mt-16 flex tablet:mt-0'>
            <div className='border-r-1 border-r-gray-300 pr-12 tablet:pr-20'>
              <Badge>{title}</Badge>
            </div>
            <div className='ml-12 flex h-fit flex-wrap items-center gap-8 tablet:ml-20'>
              {data?.tags?.map((tag) => {
                return (
                  <Tag key={tag} className='bg-amber-100'>
                    {tag}
                  </Tag>
                );
              })}
            </div>
          </div>
          <div>
            <p className='mt-16 mb-32 text-xs/18 tablet:text-[14px]/24'>{data.description}</p>
          </div>
          <img
            alt='사용자가 추가한 이미지입니다.'
            className='h-168 rounded-[6px] bg-gray-500 tablet:h-246 pc:h-260'
            src={data.imageUrl}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className='relative mt-16'>
            <Form
              encType='multipart/form-data'
              id='createComment'
              method='post'
              onSubmit={handleSubmit((data) => {
                onSubmit(data);
              })}
            >
              <Input.Root>
                <Input.Label htmlFor='content'>댓글</Input.Label>
                <Input.Field {...register('content')} id='content' placeholder='댓글 작성하기' type='textarea' />
              </Input.Root>
              {selectedComment ? (
                <Button
                  className='absolute right-12 bottom-12 h-32 text-xs'
                  type='button'
                  variant='outlined'
                  onClick={editSubmit}
                >
                  수정 완료
                </Button>
              ) : (
                <Button
                  className='absolute right-12 bottom-12 h-32 text-xs'
                  form='createComment'
                  type='submit'
                  variant='outlined'
                >
                  입력
                </Button>
              )}
            </Form>
          </div>
          <div className='max-h-160 overflow-y-auto'>
            {commentList &&
              commentList.map((comment) => {
                return (
                  <Comment
                    key={comment.id}
                    data={comment}
                    onDelete={() => deleteComment(comment.id)}
                    onEdit={(data) => setSelectedComment(data)}
                  />
                );
              })}
            {isCommentLoading && [1, 2, 3].map((id) => <SkeletonComment key={id} />)}
            <div ref={ref} className='h-1' />
          </div>
        </section>
        <section className='flex justify-between rounded-lg border-1 border-gray-300 px-16 py-9 tablet:h-155 tablet:w-181 tablet:flex-col tablet:px-16 tablet:py-14.5 pc:w-200'>
          <div className='flex w-1/2 flex-none flex-col gap-8 tablet:w-full'>
            <h2 className='text-xs/20 font-semibold'>담당자</h2>
            <div className='flex items-center text-xs/20 tablet:text-md/24'>
              <Avatar
                className='mr-8'
                nickname={data.assignee.nickname}
                src={data.assignee.profileImageUrl && data.assignee.profileImageUrl}
              />
              {data.assignee.nickname}
            </div>
          </div>
          <div className='flex w-1/2 flex-col gap-8 tablet:w-full'>
            <h2 className='text-xs/20 font-semibold'>마감일</h2>
            <div className='text-xs tablet:text-md'>{data.dueDate}</div>
          </div>
        </section>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default CardDetail;
