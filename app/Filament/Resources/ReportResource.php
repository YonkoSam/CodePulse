<?php

namespace App\Filament\Resources;

use App\Enums\ReportReason;
use App\Filament\Resources\ReportResource\Pages;
use App\Models\Report;
use App\Models\User;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Get;
use Filament\Resources\Resource;
use Filament\Tables\Actions\Action;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ReportResource extends Resource
{
    protected static ?string $model = Report::class;

    protected static ?string $slug = 'reports';

    protected static ?string $navigationIcon = 'heroicon-o-flag';

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->with(['reportable']))
            ->columns([
                TextColumn::make('user.name')
                    ->label(__('Reported by'))
                    ->searchable()
                    ->sortable(),
                TextColumn::make('reportable')
                    ->label(__('Reported Item'))
                    ->formatStateUsing(function ($state) {
                        return match (true) {
                            method_exists($state, 'user') => $state->user->name.' (user)',
                            method_exists($state, 'sender') => $state->sender->name.' (sender)',
                            method_exists($state, 'owner') => $state->owner->name.' (team owner)',
                            default => $state->id,
                        };
                    }),

                TextColumn::make('reportable_type')
                    ->label(__('Reported Type'))
                    ->formatStateUsing(fn ($state) => class_basename($state)),

                TextColumn::make('reason')
                    ->label(__('Reason'))
                    ->badge()
                    ->formatStateUsing(fn ($state) => $state->name)
                    ->description(fn (Report $record): string => $record->additional_text ?? ''),
            ])
            ->filters([
                SelectFilter::make('user')
                    ->relationship('user', 'name')
                    ->label(__('User'))
                    ->placeholder(__('All Users'))
                    ->searchable()
                    ->preload(),
                SelectFilter::make('reportable_type')
                    ->options([
                        'App\Models\Profile' => 'Profile',
                        'App\Models\Message' => 'Message',
                        'App\Models\Pulse' => 'Pulse',
                        'App\Models\Comment' => 'Comment',
                        'App\Models\Team' => 'Team',
                    ])
                    ->label(__('Reported Type'))
                    ->placeholder(__('All Types')),

            ])
            ->actions([
                DeleteAction::make(),
                Action::make('toggleSuspension')
                    ->label(fn (Report $record): string => self::getUserFromReportable($record)?->is_suspended ? 'Unsuspend' : 'Suspend')
                    ->icon(fn (Report $record): string => self::getUserFromReportable($record)?->is_suspended ? 'heroicon-o-lock-open' : 'heroicon-o-lock-closed')
                    ->action(function (Report $record, array $data): void {
                        $user = self::getUserFromReportable($record);
                        if (! $user) {
                            return;
                        }
                        $user->is_suspended = ! $user->is_suspended;
                        if ($user->is_suspended) {
                            $user->addSuspensionReason($data['suspension_reason']);
                            if ($data['suspension_reason'] === ReportReason::Other->name) {
                                $user->addSuspensionReason($data['custom_suspension_reason']);
                            }
                        }
                        $user->save();
                    })
                    ->form([
                        Select::make('suspension_reason')
                            ->label('Suspension Reason')
                            ->options(
                                collect(ReportReason::cases())->flatMap(fn ($reason) => [
                                    Str::headline($reason->name) => Str::headline($reason->name),
                                ])
                            )->required()
                            ->default(fn ($record) => $record->reason->name)
                            ->visible(fn (Report $record): bool => ! self::getUserFromReportable($record)?->is_suspended)
                            ->reactive(),
                        TextInput::make('custom_suspension_reason')
                            ->label('Custom Suspension Reason')
                            ->required()
                            ->default(fn ($record) => $record->additional_text)
                            ->visible(fn (Report $record, Get $get): bool => ! self::getUserFromReportable($record)?->is_suspended && $get('suspension_reason') === ReportReason::Other->name),
                    ])
                    ->requiresConfirmation()
                    ->modalDescription(fn (Report $record): string => 'Are you sure you want to suspend '.self::getUserFromReportable($record)?->name.'for this report?')
                    ->visible(fn (Report $record): bool => self::getUserFromReportable($record) !== null),

            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    private static function getUserFromReportable(Report $record): ?User
    {
        $reportable = $record->reportable;
        if (method_exists($reportable, 'user')) {
            return $reportable->user;
        } elseif (method_exists($reportable, 'owner')) {
            return $reportable->owner;
        } elseif (method_exists($reportable, 'sender')) {
            return $reportable->sender;
        }

        return null;
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListReports::route('/'),
            'create' => Pages\CreateReport::route('/create'),

        ];
    }

    public static function getGlobalSearchEloquentQuery(): Builder
    {
        return parent::getGlobalSearchEloquentQuery()->with(['user']);
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['user.name'];
    }

    public static function getGlobalSearchResultDetails(Model $record): array
    {
        $details = [];

        if ($record->user) {
            $details['User'] = $record->user->name;
        }

        return $details;
    }
}
