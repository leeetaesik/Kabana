import CrownIcon from '@/assets/icons/CrownIcon';
import Avatar from '@/components/Avatar';
import Button from '@/components/common/button';
import type { MembersProps } from '@/components/dashboardEdit/types';

const Members = ({ id, nickname, profileImg, isLast, isOwner, onDelete }: MembersProps) => {
  return (
    <>
      <li className='flex items-center justify-between px-20 py-12 tablet:px-28 tablet:py-16'>
        <div className='flex items-center justify-between gap-8'>
          <Avatar nickname={nickname} src={profileImg} />
          <span className='text-md tablet:text-lg'>{nickname}</span>
        </div>
        {isOwner ? (
          <span className='flex w-84 items-center justify-center gap-4'>
            <CrownIcon size={20} />
            <span>Owner</span>
          </span>
        ) : (
          <Button
            className='w-52 p-0 tablet:w-84 tablet:text-md'
            size='sm'
            type='button'
            variant='outlined'
            onClick={() => onDelete(id)}
          >
            삭제
          </Button>
        )}
      </li>
      {!isLast && <div className='border-b border-gray-200' />}
    </>
  );
};

export default Members;
